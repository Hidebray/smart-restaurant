import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { GetAnalyticsDto } from './dto/get-analytics.dto';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * Get comprehensive dashboard analytics
   * GET /analytics/dashboard
   */
  @Get('dashboard')
  getDashboard(@Query() query: GetAnalyticsDto) {
    return this.analyticsService.getDashboardAnalytics(query);
  }

  /**
   * Get revenue analytics
   * GET /analytics/revenue
   */
  @Get('revenue')
  getRevenue(@Query() query: GetAnalyticsDto) {
    return this.analyticsService.getRevenueAnalytics(query);
  }

  /**
   * Get customer analytics
   * GET /analytics/customers
   */
  @Get('customers')
  getCustomers(@Query() query: GetAnalyticsDto) {
    return this.analyticsService.getCustomerAnalytics(query);
  }

  /**
   * Get product analytics
   * GET /analytics/products
   */
  @Get('products')
  getProducts(@Query() query: GetAnalyticsDto) {
    return this.analyticsService.getProductAnalytics(query);
  }

  /**
   * Get table analytics
   * GET /analytics/tables
   */
  @Get('tables')
  getTables(@Query() query: GetAnalyticsDto) {
    return this.analyticsService.getTableAnalytics(query);
  }

  /**
   * Get reservation analytics
   * GET /analytics/reservations
   */
  @Get('reservations')
  getReservations(@Query() query: GetAnalyticsDto) {
    return this.analyticsService.getReservationAnalytics(query);
  }

  /**
   * Get historical snapshots
   * GET /analytics/snapshots
   */
  @Get('snapshots')
  getSnapshots(@Query('limit') limit?: string) {
    return this.analyticsService.getHistoricalSnapshots(
      limit ? parseInt(limit, 10) : 30,
    );
  }
}
