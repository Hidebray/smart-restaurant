import { BadRequestException, Injectable, Inject, forwardRef } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrdersGateway } from 'src/events/orders.gateway';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { LoyaltyService } from '../loyalty/loyalty.service';
import { InventoryService } from '../inventory/inventory.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private ordersGateway: OrdersGateway,
    @Inject(forwardRef(() => LoyaltyService))
    private loyaltyService?: LoyaltyService,
    @Inject(forwardRef(() => InventoryService))
    private inventoryService?: InventoryService,
  ) { }

  async create(createOrderDto: CreateOrderDto) {
    const { tableId, items, notes } = createOrderDto;

    // DEBUG LOGGING
    console.log('=== CREATE ORDER DEBUG ===');
    console.log('customerId:', createOrderDto.customerId);
    console.log('pointsToRedeem:', createOrderDto.pointsToRedeem);
    console.log('voucherCode:', createOrderDto.voucherCode);
    console.log('========================');

    if (!items?.length) {
      throw new BadRequestException("The order must have at least one item.");
    }

    const result = await this.prisma.$transaction(async (tx) => {
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

      // POINTS REDEMPTION LOGIC - Only validate here, actual redemption happens after order creation
      let pointsDiscountAmount = 0;
      let shouldRedeemPoints = false;
      
      if (createOrderDto.pointsToRedeem && createOrderDto.pointsToRedeem >= 100 && createOrderDto.customerId) {
        try {
          // Validate points (don't deduct yet)
          const loyaltyPoints = await this.loyaltyService?.getOrCreateLoyaltyPoints(createOrderDto.customerId);
          
          if (loyaltyPoints && loyaltyPoints.points >= createOrderDto.pointsToRedeem) {
            // Calculate discount: 100 points = 10,000 VND
            pointsDiscountAmount = (createOrderDto.pointsToRedeem / 100) * 10000;
            // Cap at total amount
            pointsDiscountAmount = Math.min(pointsDiscountAmount, totalAmount);
            shouldRedeemPoints = true;
            console.log('Points validated - will redeem after order creation:', pointsDiscountAmount);
          }
        } catch (error) {
          console.error('Failed to validate points:', error);
          pointsDiscountAmount = 0;
        }
      }

      // VOUCHER LOGIC
      let discountType: any = null;
      let discountValue: any = 0;
      let voucherId: string | null = null;
      let discountAmount = 0;

      if (createOrderDto.voucherCode) {
        const voucher = await tx.voucher.findUnique({
          where: { code: createOrderDto.voucherCode }
        });

        if (!voucher) {
          throw new BadRequestException('Mã giảm giá không tồn tại');
        }

        if (!voucher.isActive) throw new BadRequestException('Mã giảm giá đã hết hạn hoặc bị khóa');
        if (voucher.expiryDate && new Date() > voucher.expiryDate) throw new BadRequestException('Mã giảm giá đã hết hạn');
        if (voucher.maxUses && voucher.usedCount >= voucher.maxUses) throw new BadRequestException('Mã giảm giá đã hết lượt sử dụng');
        if (voucher.minOrderAmount && totalAmount < Number(voucher.minOrderAmount)) throw new BadRequestException(`Đơn hàng phải tối thiểu ${voucher.minOrderAmount} để sử dụng mã này`);

        discountType = voucher.discountType;
        discountValue = Number(voucher.discountValue);
        voucherId = voucher.id;

        if (discountType === 'PERCENT') {
          discountAmount = (totalAmount * discountValue) / 100;
        } else {
          discountAmount = Math.min(discountValue, totalAmount);
        }

        // Increment usage
        await tx.voucher.update({
          where: { id: voucherId },
          data: { usedCount: { increment: 1 } }
        });
      }

      // Check for an existing pending order for this table
      const existingOrder = await tx.order.findFirst({
        where: { tableId, status: 'PENDING' },
        include: { items: true },
      });

      if (existingOrder) {
        // Append new items to the existing order and update totalAmount
        const existingTotal = Number(existingOrder.totalAmount ?? 0);
        let finalTotal = existingTotal + totalAmount; // Total amount BEFORE discount

        // Note: If appending to existing order, complex logic arises for voucher re-calculation.
        // For simplicity: If an order already exists, we might reject a NEW voucher or apply it to the whole sum?
        // Let's assume for Guest view, they usually create one order session.
        // If they add more items, we just add items.
        // If they provided a voucher NOW, should we apply it?
        // Let's apply valid voucher to the TOTAL (existing + new).

        // If existing order already had a discount?
        // We overwrite with new voucher if provided, or keep old?
        // Simplified: If voucher provided, overwrite.

        let newDiscountType = existingOrder.discountType;
        let newDiscountValue = Number(existingOrder.discountValue);

        if (voucherId && createOrderDto.customerId) {
          newDiscountType = discountType;
          newDiscountValue = discountValue;
          // Record redemption for this order if not already?
          // Actually, if we merge, we should probably record redemption linked to the ORDER ID.
          await tx.voucherRedemption.create({
            data: {
              voucherId: voucherId,
              userId: createOrderDto.customerId,
              orderId: existingOrder.id,
              discountAmount: discountAmount
            }
          });
        } else if (voucherId) {
          // If guest, just apply discount but don't record user redemption
          newDiscountType = discountType;
          newDiscountValue = discountValue;
        }

        const updatedOrder = await tx.order.update({
          where: { id: existingOrder.id },
          data: {
            totalAmount: finalTotal,
            ...(createOrderDto.customerId ? { customerId: createOrderDto.customerId } : {}),
            ...(notes !== undefined ? { notes: notes || null } : {}),
            ...(voucherId ? { discountType: newDiscountType, discountValue: newDiscountValue } : {}),
            items: {
              create: orderItemsData,
            },
          },
          include: { items: { include: { product: true, modifiers: { include: { modifierOption: true } } } }, table: true },
        });

        // Emit websocket event for waiter clients only
        try { this.ordersGateway.emitNewOrderToWaiters(updatedOrder); } catch (e) { /* ignore */ }

        // Return with flag - no points redemption for existing order append (complex scenario)
        return { order: updatedOrder, shouldRedeemPoints: false, pointsToRedeem: 0 };
      }

      // Calculate total discount (voucher + points)
      const totalDiscountAmount = discountAmount + pointsDiscountAmount;
      console.log('=== DISCOUNT CALCULATION ===');
      console.log('voucherDiscountAmount:', discountAmount);
      console.log('pointsDiscountAmount:', pointsDiscountAmount);
      console.log('totalDiscountAmount:', totalDiscountAmount);

      // Determine final discount type and value
      // If we have both voucher and points discount, use FIXED type with combined amount
      let finalDiscountType = discountType;
      let finalDiscountValue = discountValue;
      
      if (pointsDiscountAmount > 0) {
        if (discountAmount > 0) {
          // Both voucher and points: combine as FIXED
          finalDiscountType = 'FIXED';
          finalDiscountValue = totalDiscountAmount;
        } else {
          // Only points discount
          finalDiscountType = 'FIXED';
          finalDiscountValue = pointsDiscountAmount;
        }
      }
      console.log('finalDiscountType:', finalDiscountType);
      console.log('finalDiscountValue:', finalDiscountValue);

      // No existing order, create a new one
      const newOrder = await tx.order.create({
        data: {
          tableId,
          totalAmount,
          status: 'PENDING',
          customerId: createOrderDto.customerId,
          notes: notes || null,
          discountType: finalDiscountType,
          discountValue: finalDiscountValue,
          items: {
            create: orderItemsData,
          },
        },
        include: { items: { include: { product: true, modifiers: { include: { modifierOption: true } } } }, table: true },
      });

      if (voucherId) {
        // We need a userId for redemption. If guest, maybe we need to relax constraints or use a dummy.
        // Schema says userId is required. This is a problem for anonymous guests.
        // However, createOrderDto.customerId is optional.
        // If customerId is present, use it. If not, we might fail or need a fallback.
        // For now, only logged in users might use vouchers? Or we check schema.
        // Schema: userId String @map("user_id") in VoucherRedemption.
        // So yes, anonymous users cannot "Redeem" a voucher in the strict sense of tracking.
        // BUT they can still get the discount on the order.

        if (createOrderDto.customerId) {
          await tx.voucherRedemption.create({
            data: {
              voucherId: voucherId,
              userId: createOrderDto.customerId,
              orderId: newOrder.id,
              discountAmount: discountAmount
            }
          });
        }
      }

      // Set table status to OCCUPIED
      await tx.table.update({
        where: { id: tableId },
        data: { status: 'OCCUPIED' },
      });

      // Emit websocket event for waiter clients only
      try { this.ordersGateway.emitNewOrderToWaiters(newOrder); } catch (e) { /* ignore */ }

      // Return order with flag for points redemption
      return { order: newOrder, shouldRedeemPoints, pointsToRedeem: createOrderDto.pointsToRedeem };
    });

    // Extract result
    const { order: newOrder, shouldRedeemPoints: shouldRedeem, pointsToRedeem } = result as any;

    // Redeem points AFTER transaction completes successfully
    if (shouldRedeem && createOrderDto.customerId && pointsToRedeem) {
      try {
        await this.loyaltyService?.redeemPoints(
          createOrderDto.customerId,
          pointsToRedeem,
          newOrder.id
        );
        console.log('Points redeemed successfully for order:', newOrder.id);
      } catch (error) {
        console.error('Failed to redeem points after order creation:', error);
        // Order already created with discount, log error but don't fail
      }
    }

    return newOrder;
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

      // 4. Update inventory when order is completed
      if (this.inventoryService) {
        try {
          await this.inventoryService.updateInventoryForOrder(updated.id, true);
        } catch (error) {
          // Log error but don't fail the order completion
          console.error('Failed to update inventory:', error);
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
  async updateItemStatus(itemId: string, status: any) {
    const item = await this.prisma.orderItem.findUnique({ where: { id: itemId } });
    if (!item) throw new BadRequestException('Item not found');

    // Update item status
    await this.prisma.orderItem.update({
      where: { id: itemId },
      data: { status },
    });

    // Check sibling items to update parent Order status
    const order = await this.prisma.order.findUnique({
      where: { id: item.orderId },
      include: { items: { include: { product: true, modifiers: { include: { modifierOption: true } } } }, table: true },
    });

    if (order) {
      let newOrderStatus = order.status;
      const allItems = order.items;
      const allReady = allItems.every(i => i.status === 'READY' || i.status === 'SERVED' || i.status === 'CANCELLED');
      const allServed = allItems.every(i => i.status === 'SERVED' || i.status === 'CANCELLED');
      const anyPreparing = allItems.some(i => i.status === 'PREPARING');

      if (allServed) {
        newOrderStatus = 'SERVED';
      } else if (allReady) {
        newOrderStatus = 'READY';
      } else if (anyPreparing && order.status !== 'PREPARING') {
        newOrderStatus = 'PREPARING';
      }

      if (newOrderStatus !== order.status) {
        const updatedOrder = await this.prisma.order.update({
          where: { id: order.id },
          data: { status: newOrderStatus },
          include: { items: { include: { product: true, modifiers: { include: { modifierOption: true } } } }, table: true },
        });

        // Emit events
        try {
          this.ordersGateway.emitOrderUpdatedToWaiters(updatedOrder);
          this.ordersGateway.emitOrderUpdatedToKitchen(updatedOrder);
        } catch (e) { /* ignore */ }
        return updatedOrder;
      } else {
        // Even if order status didn't change, formatting changed, so emit update for the item status change
        try {
          this.ordersGateway.emitOrderUpdatedToWaiters(order);
          this.ordersGateway.emitOrderUpdatedToKitchen(order);
        } catch (e) { /* ignore */ }
      }
    }
    return order;
  }
}
