import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LoyaltyService } from './loyalty.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CreatePointsTransactionDto } from './dto/create-points-transaction.dto';
import { RedeemVoucherDto } from './dto/redeem-voucher.dto';
import { UpdateTierDto } from './dto/update-tier.dto';
import { GetPointsHistoryDto } from './dto/get-points-history.dto';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';

@Controller('loyalty')
@UseGuards(JwtAuthGuard)
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  // =========================================================
  // LOYALTY POINTS ENDPOINTS
  // =========================================================

  /**
   * Get current user's loyalty points
   * GET /loyalty/points
   */
  @Get('points')
  getMyPoints(@Req() req) {
    return this.loyaltyService.getLoyaltyPoints(req.user.sub);
  }

  /**
   * Get points history for current user
   * GET /loyalty/points/history
   */
  @Get('points/history')
  getMyPointsHistory(@Req() req, @Query() query: GetPointsHistoryDto) {
    return this.loyaltyService.getPointsHistory(req.user.sub, query);
  }

  /**
   * Redeem points for discount
   * POST /loyalty/points/redeem
   */
  @Post('points/redeem')
  redeemPoints(
    @Req() req,
    @Body() body: { points: number; orderId: string },
  ) {
    return this.loyaltyService.redeemPoints(
      req.user.sub,
      body.points,
      body.orderId,
    );
  }

  /**
   * Get loyalty points for a user (admin only)
   * GET /loyalty/points/:userId
   */
  @Get('points/:userId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  getUserPoints(@Param('userId') userId: string) {
    return this.loyaltyService.getLoyaltyPoints(userId);
  }

  /**
   * Update user tier (admin only)
   * PATCH /loyalty/points/:userId/tier
   */
  @Patch('points/:userId/tier')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  updateUserTier(@Param('userId') userId: string, @Body() dto: UpdateTierDto) {
    return this.loyaltyService.updateTier(userId, dto);
  }

  /**
   * Add points manually (admin only)
   * POST /loyalty/points/:userId/add
   */
  @Post('points/:userId/add')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  addPointsManually(
    @Param('userId') userId: string,
    @Body() dto: CreatePointsTransactionDto,
  ) {
    return this.loyaltyService.addPoints(
      userId,
      dto.points,
      dto.orderId || 'manual',
      dto.description || 'Manual adjustment',
    );
  }

  // =========================================================
  // VOUCHER ENDPOINTS
  // =========================================================

  /**
   * Get available vouchers for current user
   * GET /loyalty/vouchers
   */
  @Get('vouchers')
  getAvailableVouchers(@Req() req) {
    return this.loyaltyService.getAvailableVouchers(req.user?.sub);
  }

  /**
   * Get voucher by code
   * GET /loyalty/vouchers/code/:code
   */
  @Get('vouchers/code/:code')
  getVoucherByCode(@Param('code') code: string) {
    return this.loyaltyService.getVoucherByCode(code);
  }

  /**
   * Redeem voucher for an order
   * POST /loyalty/vouchers/redeem
   */
  @Post('vouchers/redeem')
  redeemVoucher(@Req() req, @Body() dto: RedeemVoucherDto) {
    return this.loyaltyService.redeemVoucher(req.user.sub, dto);
  }

  /**
   * Get all vouchers (admin only)
   * GET /loyalty/vouchers/all
   */
  @Get('vouchers/all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  getAllVouchers(@Query('includeInactive') includeInactive?: string) {
    return this.loyaltyService.getAllVouchers(includeInactive === 'true');
  }

  /**
   * Create voucher (admin only)
   * POST /loyalty/vouchers
   */
  @Post('vouchers')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  createVoucher(@Body() dto: CreateVoucherDto) {
    return this.loyaltyService.createVoucher(dto);
  }

  /**
   * Update voucher (admin only)
   * PATCH /loyalty/vouchers/:id
   */
  @Patch('vouchers/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  updateVoucher(@Param('id') id: string, @Body() dto: UpdateVoucherDto) {
    return this.loyaltyService.updateVoucher(id, dto);
  }

  /**
   * Delete voucher (admin only)
   * DELETE /loyalty/vouchers/:id
   */
  @Delete('vouchers/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteVoucher(@Param('id') id: string) {
    return this.loyaltyService.deleteVoucher(id);
  }

  /**
   * Get voucher statistics (admin only)
   * GET /loyalty/vouchers/stats
   */
  @Get('vouchers/stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  getVoucherStats() {
    return this.loyaltyService.getVoucherStats();
  }
}
