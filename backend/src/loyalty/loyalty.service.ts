import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, LoyaltyTier, PointsTransactionType, DiscountType } from '@prisma/client';
import { CreatePointsTransactionDto } from './dto/create-points-transaction.dto';
import { RedeemVoucherDto } from './dto/redeem-voucher.dto';
import { UpdateTierDto } from './dto/update-tier.dto';
import { GetPointsHistoryDto } from './dto/get-points-history.dto';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';

@Injectable()
export class LoyaltyService {
  constructor(private prisma: PrismaService) {}

  // =========================================================
  // LOYALTY POINTS MANAGEMENT
  // =========================================================

  /**
   * Get or create loyalty points record for a user
   */
  async getOrCreateLoyaltyPoints(userId: string) {
    let loyaltyPoints = await this.prisma.loyaltyPoints.findUnique({
      where: { userId },
    });

    if (!loyaltyPoints) {
      loyaltyPoints = await this.prisma.loyaltyPoints.create({
        data: {
          userId,
          points: 0,
          tier: LoyaltyTier.BRONZE,
          totalEarned: 0,
          totalRedeemed: 0,
        },
      });
    }

    return loyaltyPoints;
  }

  /**
   * Get loyalty points for a user
   */
  async getLoyaltyPoints(userId: string) {
    return this.getOrCreateLoyaltyPoints(userId);
  }

  /**
   * Calculate points earned from an order
   * Rule: 1 point per 10,000 VND spent
   */
  calculatePointsFromOrder(orderAmount: number): number {
    return Math.floor(orderAmount / 10000);
  }

  /**
   * Calculate tier based on total points earned
   */
  calculateTier(totalEarned: number): LoyaltyTier {
    if (totalEarned >= 10000) return LoyaltyTier.PLATINUM;
    if (totalEarned >= 5000) return LoyaltyTier.GOLD;
    if (totalEarned >= 2000) return LoyaltyTier.SILVER;
    return LoyaltyTier.BRONZE;
  }

  /**
   * Add points to user account (when order is completed)
   */
  async addPoints(userId: string, points: number, orderId: string, description?: string) {
    if (points <= 0) {
      throw new BadRequestException('Points must be positive');
    }

    const loyaltyPoints = await this.getOrCreateLoyaltyPoints(userId);

    // Create transaction
    await this.prisma.pointsTransaction.create({
      data: {
        userId,
        points,
        type: PointsTransactionType.EARN,
        description: description || `Order #${orderId.substring(0, 8)}`,
        orderId,
      },
    });

    // Update loyalty points
    const newTotalEarned = loyaltyPoints.totalEarned + points;
    const newTier = this.calculateTier(newTotalEarned);

    return this.prisma.loyaltyPoints.update({
      where: { userId },
      data: {
        points: loyaltyPoints.points + points,
        totalEarned: newTotalEarned,
        tier: newTier,
      },
    });
  }

  /**
   * Redeem points (convert points to discount)
   * Rule: 100 points = 10,000 VND discount
   */
  async redeemPoints(userId: string, pointsToRedeem: number, orderId: string) {
    if (pointsToRedeem <= 0) {
      throw new BadRequestException('Points to redeem must be positive');
    }

    if (pointsToRedeem < 100) {
      throw new BadRequestException('Minimum 100 points required for redemption');
    }

    if (pointsToRedeem % 100 !== 0) {
      throw new BadRequestException('Points must be in multiples of 100');
    }

    const loyaltyPoints = await this.getOrCreateLoyaltyPoints(userId);

    if (loyaltyPoints.points < pointsToRedeem) {
      throw new BadRequestException('Insufficient points');
    }

    // Create transaction
    await this.prisma.pointsTransaction.create({
      data: {
        userId,
        points: -pointsToRedeem,
        type: PointsTransactionType.REDEEM,
        description: `Redeemed ${pointsToRedeem} points for discount`,
        orderId,
      },
    });

    // Update loyalty points
    return this.prisma.loyaltyPoints.update({
      where: { userId },
      data: {
        points: loyaltyPoints.points - pointsToRedeem,
        totalRedeemed: loyaltyPoints.totalRedeemed + pointsToRedeem,
      },
    });
  }

  /**
   * Get points history for a user
   */
  async getPointsHistory(userId: string, query: GetPointsHistoryDto) {
    const { page = 1, limit = 20, type } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.PointsTransactionWhereInput = {
      userId,
      ...(type && { type }),
    };

    const [transactions, total] = await Promise.all([
      this.prisma.pointsTransaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
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
      }),
      this.prisma.pointsTransaction.count({ where }),
    ]);

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update user tier manually (admin only)
   */
  async updateTier(userId: string, dto: UpdateTierDto) {
    const loyaltyPoints = await this.getOrCreateLoyaltyPoints(userId);

    return this.prisma.loyaltyPoints.update({
      where: { userId },
      data: {
        tier: dto.tier ?? loyaltyPoints.tier,
      },
    });
  }

  // =========================================================
  // VOUCHER MANAGEMENT
  // =========================================================

  /**
   * Create a new voucher
   */
  async createVoucher(dto: CreateVoucherDto) {
    // Check if code already exists
    const existing = await this.prisma.voucher.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new BadRequestException('Voucher code already exists');
    }

    return this.prisma.voucher.create({
      data: {
        code: dto.code,
        name: dto.name,
        description: dto.description,
        discountType: dto.discountType,
        discountValue: new Prisma.Decimal(dto.discountValue),
        minOrderAmount: dto.minOrderAmount ? new Prisma.Decimal(dto.minOrderAmount) : null,
        maxUses: dto.maxUses ?? null,
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : null,
        isActive: dto.isActive ?? true,
      },
    });
  }

  /**
   * Get all vouchers (admin)
   */
  async getAllVouchers(includeInactive = false) {
    return this.prisma.voucher.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { redemptions: true },
        },
      },
    });
  }

  /**
   * Get active vouchers available for user
   */
  async getAvailableVouchers(userId?: string) {
    const now = new Date();

    return this.prisma.voucher.findMany({
      where: {
        isActive: true,
        AND: [
          {
            OR: [
              { expiryDate: null },
              { expiryDate: { gte: now } },
            ],
          },
          {
            OR: [
              { maxUses: null },
              {
                AND: [
                  { maxUses: { not: null } },
                  { usedCount: { lt: Prisma.sql`max_uses` } },
                ],
              },
            ],
          },
        ],
      },
      orderBy: { discountValue: 'desc' },
    });
  }

  /**
   * Get voucher by code
   */
  async getVoucherByCode(code: string) {
    const voucher = await this.prisma.voucher.findUnique({
      where: { code },
    });

    if (!voucher) {
      throw new NotFoundException('Voucher not found');
    }

    return voucher;
  }

  /**
   * Validate voucher for redemption
   */
  async validateVoucher(code: string, orderAmount: number, userId?: string) {
    const voucher = await this.getVoucherByCode(code);

    if (!voucher.isActive) {
      throw new BadRequestException('Voucher is not active');
    }

    // Check expiry
    if (voucher.expiryDate && voucher.expiryDate < new Date()) {
      throw new BadRequestException('Voucher has expired');
    }

    // Check max uses
    if (voucher.maxUses && voucher.usedCount >= voucher.maxUses) {
      throw new BadRequestException('Voucher has reached maximum uses');
    }

    // Check minimum order amount
    if (voucher.minOrderAmount && orderAmount < Number(voucher.minOrderAmount)) {
      throw new BadRequestException(
        `Minimum order amount is ${voucher.minOrderAmount} VND`,
      );
    }

    return voucher;
  }

  /**
   * Redeem voucher for an order
   */
  async redeemVoucher(userId: string, dto: RedeemVoucherDto) {
    const { code, orderId } = dto;

    // Get order to check amount
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.customerId !== userId) {
      throw new BadRequestException('Order does not belong to user');
    }

    // Validate voucher
    const voucher = await this.validateVoucher(code, Number(order.totalAmount), userId);

    // Calculate discount amount
    let discountAmount = 0;
    if (voucher.discountType === DiscountType.PERCENT) {
      discountAmount = (Number(order.totalAmount) * Number(voucher.discountValue)) / 100;
    } else {
      discountAmount = Number(voucher.discountValue);
    }

    // Cap discount at order total
    discountAmount = Math.min(discountAmount, Number(order.totalAmount));

    // Create redemption record
    await this.prisma.voucherRedemption.create({
      data: {
        userId,
        voucherId: voucher.id,
        orderId,
        discountAmount: new Prisma.Decimal(discountAmount),
      },
    });

    // Update voucher used count
    await this.prisma.voucher.update({
      where: { id: voucher.id },
      data: {
        usedCount: voucher.usedCount + 1,
      },
    });

    return {
      voucher,
      discountAmount,
    };
  }

  /**
   * Update voucher
   */
  async updateVoucher(id: string, dto: UpdateVoucherDto) {
    const voucher = await this.prisma.voucher.findUnique({
      where: { id },
    });

    if (!voucher) {
      throw new NotFoundException('Voucher not found');
    }

    return this.prisma.voucher.update({
      where: { id },
      data: {
        ...(dto.code && { code: dto.code }),
        ...(dto.name && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.discountType && { discountType: dto.discountType }),
        ...(dto.discountValue !== undefined && {
          discountValue: new Prisma.Decimal(dto.discountValue),
        }),
        ...(dto.minOrderAmount !== undefined && {
          minOrderAmount: dto.minOrderAmount ? new Prisma.Decimal(dto.minOrderAmount) : null,
        }),
        ...(dto.maxUses !== undefined && { maxUses: dto.maxUses ?? null }),
        ...(dto.expiryDate !== undefined && {
          expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : null,
        }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });
  }

  /**
   * Delete voucher
   */
  async deleteVoucher(id: string) {
    const voucher = await this.prisma.voucher.findUnique({
      where: { id },
    });

    if (!voucher) {
      throw new NotFoundException('Voucher not found');
    }

    return this.prisma.voucher.delete({
      where: { id },
    });
  }

  /**
   * Get voucher statistics
   */
  async getVoucherStats() {
    const [total, active, expired, totalRedemptions] = await Promise.all([
      this.prisma.voucher.count(),
      this.prisma.voucher.count({ where: { isActive: true } }),
      this.prisma.voucher.count({
        where: {
          expiryDate: { lt: new Date() },
        },
      }),
      this.prisma.voucherRedemption.count(),
    ]);

    return {
      total,
      active,
      expired,
      totalRedemptions,
    };
  }
}
