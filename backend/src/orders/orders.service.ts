import { BadRequestException, Injectable, Inject, forwardRef } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrdersGateway } from 'src/events/orders.gateway';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { LoyaltyService } from '../loyalty/loyalty.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private ordersGateway: OrdersGateway,
    @Inject(forwardRef(() => LoyaltyService))
    private loyaltyService?: LoyaltyService,
  ) { }

  async create(createOrderDto: CreateOrderDto) {
    const { tableId, items, notes } = createOrderDto;

    if (!items?.length) {
      throw new BadRequestException("The order must have at least one item.");
    }

    return this.prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsData: any[] = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new BadRequestException(`The product with Id ${item.productId} does not exists.`)
        }

        if (product.status !== 'AVAILABLE') {
          throw new BadRequestException(`"${product.name}" is sold out.`)
        }

        // Handle modifiers if provided
        let modifierTotal = 0;
        const modifierCreates: any[] = [];
        if (item.modifiers && item.modifiers.length > 0) {
          const modifierIds = item.modifiers.map((m: any) => m.modifierOptionId);
          const mods = await tx.modifierOption.findMany({ where: { id: { in: modifierIds } } });
          const modMap = new Map(mods.map(m => [m.id, m]));
          for (const m of item.modifiers) {
            const rec = modMap.get(m.modifierOptionId);
            const priceAdj = rec ? Number(rec.priceAdjustment ?? 0) : 0;
            modifierTotal += priceAdj;
            modifierCreates.push({ modifierOptionId: m.modifierOptionId, priceAtOrder: priceAdj });
          }
        }

        const unitPrice = Number(product.price) + modifierTotal;
        const itemTotal = unitPrice * item.quantity;
        totalAmount += itemTotal;

        const orderItemPayload: any = {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: unitPrice,
          totalPrice: itemTotal,
        };

        if (modifierCreates.length > 0) {
          orderItemPayload.modifiers = { create: modifierCreates };
        }

        orderItemsData.push(orderItemPayload);
      }

      // Check for an existing pending order for this table
      const existingOrder = await tx.order.findFirst({
        where: { tableId, status: 'PENDING' },
        include: { items: true },
      });

      if (existingOrder) {
        // Append new items to the existing order and update totalAmount
        const existingTotal = Number(existingOrder.totalAmount ?? 0);
        const updatedTotal = existingTotal + totalAmount;

        const updatedOrder = await tx.order.update({
          where: { id: existingOrder.id },
          data: {
            totalAmount: updatedTotal,
            ...(createOrderDto.customerId ? { customerId: createOrderDto.customerId } : {}),
            ...(notes !== undefined ? { notes: notes || null } : {}),
            items: {
              create: orderItemsData,
            },
          },
          include: { items: { include: { product: true, modifiers: { include: { modifierOption: true } } } }, table: true },
        });

        // Emit websocket event for waiter clients only
        try { this.ordersGateway.emitNewOrderToWaiters(updatedOrder); } catch (e) { /* ignore */ }

        return updatedOrder;
      }

      // No existing order, create a new one
      const newOrder = await tx.order.create({
        data: {
          tableId,
          totalAmount,
          status: 'PENDING',
          customerId: createOrderDto.customerId,
          notes: notes || null,
          items: {
            create: orderItemsData,
          },
        },
        include: { items: { include: { product: true, modifiers: { include: { modifierOption: true } } } }, table: true },
      });

      // Set table status to OCCUPIED
      await tx.table.update({
        where: { id: tableId },
        data: { status: 'OCCUPIED' },
      });

      // Emit websocket event for waiter clients only
      try { this.ordersGateway.emitNewOrderToWaiters(newOrder); } catch (e) { /* ignore */ }

      return newOrder;
    })
  }

  findAll(filter?: any) {
    return this.prisma.order.findMany({
      where: filter,
      include: {
        items: { include: { product: true, modifiers: { include: { modifierOption: true } } } },
        table: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async updateStatus(id: string, status: any) {
    const updated = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: { items: { include: { product: true, modifiers: { include: { modifierOption: true } } } }, table: true },
    });

    // If order is completed, set table back to AVAILABLE and update product popularity
    if (status === 'COMPLETED') {
      await this.prisma.$transaction(async (tx) => {
        // 1. Free the table
        await tx.table.update({
          where: { id: updated.tableId },
          data: { status: 'AVAILABLE' },
        });

        // 2. Increment order count for products
        for (const item of updated.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { orderCount: { increment: item.quantity } },
          });
        }
      });

      // 3. Add loyalty points if customer exists and loyalty service is available
      if (updated.customerId && this.loyaltyService) {
        try {
          const orderAmount = Number(updated.totalAmount ?? 0);
          const points = this.loyaltyService.calculatePointsFromOrder(orderAmount);
          if (points > 0) {
            await this.loyaltyService.addPoints(
              updated.customerId,
              points,
              updated.id,
              `Đơn hàng #${updated.id.substring(0, 8)}`,
            );
          }
        } catch (error) {
          // Log error but don't fail the order completion
          console.error('Failed to add loyalty points:', error);
        }
      }
    }

    try {
      // Notify waiters about status change
      this.ordersGateway.emitOrderUpdatedToWaiters(updated);

      // Notify kitchen about status updates
      this.ordersGateway.emitOrderUpdatedToKitchen(updated);

      // If waiter accepted the order, explicitly send 'new order' event to kitchen
      if (updated.status === 'ACCEPTED') {
        this.ordersGateway.emitOrderToKitchen(updated);
      }
    } catch (e) { /* ignore */ }

    return updated;
  }

  async updateDiscount(id: string, dto: UpdateDiscountDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true, modifiers: { include: { modifierOption: true } } } }, table: true },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    const subtotal = Number(order.totalAmount ?? 0);
    let discountType = dto.discountType ?? null;
    let discountValue = dto.discountValue ?? 0;

    if (!discountType || discountValue <= 0) {
      discountType = null;
      discountValue = 0;
    }

    if (discountType === 'PERCENT' && discountValue > 100) {
      throw new BadRequestException('Percent discount cannot exceed 100');
    }

    if (discountType === 'FIXED' && discountValue > subtotal) {
      discountValue = subtotal;
    }

    const updated = await this.prisma.order.update({
      where: { id },
      data: {
        discountType,
        discountValue: new Prisma.Decimal(discountValue ?? 0),
      },
      include: { items: { include: { product: true, modifiers: { include: { modifierOption: true } } } }, table: true },
    });

    try {
      this.ordersGateway.emitOrderUpdatedToWaiters(updated);
    } catch (e) { /* ignore */ }

    return updated;
  }
}
