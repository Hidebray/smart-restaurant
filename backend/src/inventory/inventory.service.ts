import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, InventoryTransactionType } from '@prisma/client';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { CreateInventoryTransactionDto } from './dto/inventory-transaction.dto';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  // =========================================================
  // INVENTORY MANAGEMENT
  // =========================================================

  /**
   * Get or create inventory for a product
   */
  async getOrCreateInventory(productId: string) {
    let inventory = await this.prisma.inventory.findUnique({
      where: { productId },
      include: { product: { select: { id: true, name: true } } },
    });

    if (!inventory) {
      inventory = await this.prisma.inventory.create({
        data: {
          productId,
          quantity: 0,
          minStock: 0,
          maxStock: 1000,
          unit: 'pcs',
        },
        include: { product: { select: { id: true, name: true } } },
      });
    }

    return inventory;
  }

  /**
   * Get all inventory items
   */
  async findAll(includeLowStock = false) {
    // Note: Prisma doesn't support comparing two fields directly in where clause
    // We'll filter in memory for low stock

    const inventories = await this.prisma.inventory.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
      orderBy: [
        { quantity: 'asc' }, // Low stock first
        { product: { name: 'asc' } },
      ],
    });

    // Filter low stock in memory if needed
    if (includeLowStock) {
      return inventories.filter((inv) => inv.quantity <= inv.minStock);
    }

    return inventories;
  }

  /**
   * Get inventory by product ID
   */
  async findByProductId(productId: string) {
    return this.getOrCreateInventory(productId);
  }

  /**
   * Create inventory for a product
   */
  async create(dto: CreateInventoryDto) {
    // Check if inventory already exists
    const existing = await this.prisma.inventory.findUnique({
      where: { productId: dto.productId },
    });

    if (existing) {
      throw new BadRequestException('Inventory already exists for this product');
    }

    // Verify product exists
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.inventory.create({
      data: {
        productId: dto.productId,
        quantity: dto.quantity ?? 0,
        minStock: dto.minStock ?? 0,
        maxStock: dto.maxStock ?? 1000,
        unit: dto.unit ?? 'pcs',
      },
      include: { product: { select: { id: true, name: true } } },
    });
  }

  /**
   * Update inventory
   */
  async update(id: string, dto: UpdateInventoryDto) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { id },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    return this.prisma.inventory.update({
      where: { id },
      data: {
        ...(dto.quantity !== undefined && { quantity: dto.quantity }),
        ...(dto.minStock !== undefined && { minStock: dto.minStock }),
        ...(dto.maxStock !== undefined && { maxStock: dto.maxStock }),
        ...(dto.unit !== undefined && { unit: dto.unit }),
      },
      include: { product: { select: { id: true, name: true } } },
    });
  }

  /**
   * Delete inventory
   */
  async delete(id: string) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { id },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    return this.prisma.inventory.delete({
      where: { id },
    });
  }

  /**
   * Get low stock alerts
   */
  async getLowStockAlerts() {
    // Get all inventories and filter in memory (Prisma doesn't support field comparison)
    const inventories = await this.prisma.inventory.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
      orderBy: { quantity: 'asc' },
    });

    // Filter low stock items
    const lowStockItems = inventories.filter((inv) => inv.quantity <= inv.minStock);

    return lowStockItems.map((inv) => ({
      ...inv,
      isLowStock: inv.quantity <= inv.minStock,
      stockLevel: inv.minStock > 0 ? (inv.quantity / inv.minStock) * 100 : 0,
    }));
  }

  // =========================================================
  // INVENTORY TRANSACTIONS
  // =========================================================

  /**
   * Create inventory transaction and update stock
   */
  async createTransaction(dto: CreateInventoryTransactionDto) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { id: dto.inventoryId },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    const quantityBefore = inventory.quantity;
    const quantityAfter = quantityBefore + dto.quantity;

    // Validate stock levels
    if (quantityAfter < 0) {
      throw new BadRequestException('Insufficient stock');
    }

    if (dto.maxStock && quantityAfter > dto.maxStock) {
      throw new BadRequestException('Stock exceeds maximum capacity');
    }

    // Create transaction and update inventory in a transaction
    return this.prisma.$transaction(async (tx) => {
      // Create transaction record
      const transaction = await tx.inventoryTransaction.create({
        data: {
          inventoryId: dto.inventoryId,
          quantity: dto.quantity,
          type: dto.type,
          reason: dto.reason,
          orderId: dto.orderId,
          quantityBefore,
          quantityAfter,
        },
      });

      // Update inventory
      await tx.inventory.update({
        where: { id: dto.inventoryId },
        data: {
          quantity: quantityAfter,
          ...(dto.type === InventoryTransactionType.IN && {
            lastRestocked: new Date(),
          }),
        },
      });

      return transaction;
    });
  }

  /**
   * Get transaction history for an inventory item
   */
  async getTransactionHistory(inventoryId: string, limit = 50) {
    return this.prisma.inventoryTransaction.findMany({
      where: { inventoryId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        order: {
          select: {
            id: true,
            totalAmount: true,
            createdAt: true,
          },
        },
      },
    });
  }

  /**
   * Auto-update inventory when order is created/completed
   * This will be called from OrdersService
   */
  async updateInventoryForOrder(orderId: string, isCompleted: boolean) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              include: { inventory: true },
            },
          },
        },
      },
    });

    if (!order) {
      return;
    }

    // For each order item, reduce inventory when order is completed
    if (isCompleted) {
      for (const item of order.items) {
        if (item.product.inventory) {
          try {
            await this.createTransaction({
              inventoryId: item.product.inventory.id,
              quantity: -item.quantity, // Negative for OUT
              type: InventoryTransactionType.OUT,
              reason: `Order #${orderId.substring(0, 8)} completed`,
              orderId,
            });
          } catch (error) {
            // Log error but don't fail the order completion
            console.error(
              `Failed to update inventory for product ${item.productId}:`,
              error,
            );
          }
        }
      }
    }
  }

  /**
   * Restock inventory
   */
  async restock(inventoryId: string, quantity: number, reason?: string) {
    return this.createTransaction({
      inventoryId,
      quantity,
      type: InventoryTransactionType.IN,
      reason: reason || 'Manual restock',
    });
  }

  /**
   * Adjust inventory (manual correction)
   */
  async adjust(
    inventoryId: string,
    newQuantity: number,
    reason?: string,
  ) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { id: inventoryId },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    const adjustment = newQuantity - inventory.quantity;

    return this.createTransaction({
      inventoryId,
      quantity: adjustment,
      type: InventoryTransactionType.ADJUSTMENT,
      reason: reason || 'Manual adjustment',
    });
  }

  /**
   * Get inventory statistics
   */
  async getStats() {
    const [allInventories, outOfStock, totalValue] = await Promise.all([
      this.prisma.inventory.findMany(),
      this.prisma.inventory.count({
        where: { quantity: 0 },
      }),
      // Calculate total value (would need product prices, simplified here)
      this.prisma.inventory.aggregate({
        _sum: { quantity: true },
      }),
    ]);

    const total = allInventories.length;
    const lowStock = allInventories.filter((inv) => inv.quantity <= inv.minStock).length;

    return {
      total,
      lowStock,
      outOfStock,
      totalItems: totalValue._sum.quantity ?? 0,
    };
  }
}
