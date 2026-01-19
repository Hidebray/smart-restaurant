import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { RevenueQueryDto } from './dto/revenue-query.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // Existing (giữ lại nếu bạn đang dùng)
  @Get('summary')
  getSummary(@Query('from') from: string, @Query('to') to: string) {
    return this.reportsService.getSummary(from, to);
  }

  // Existing (đổi route thành top-products/simple để tránh trùng)
  @Get('top-products/simple')
  getTopProducts(@Query('take') take: string) {
    const takeValue = take ? parseInt(take, 10) : 5;
    return this.reportsService.getTopProducts(takeValue);
  }

  // ✅ Task 7.10: revenue chart data (day/week/month + from/to)
  @Get('revenue')
  revenue(@Query() q: RevenueQueryDto) {
    return this.reportsService.revenue(q);
  }

  // ✅ Task 7.10: top products pie data (from/to + optional take)
  @Get('top-products')
  topProducts(@Query() q: RevenueQueryDto) {
    return this.reportsService.topProducts(q);
  }

  // ✅ Task 7.10: order trends line data (day/week/month + from/to)
  @Get('orders-trend')
  ordersTrend(@Query() q: RevenueQueryDto) {
    return this.reportsService.ordersTrend(q);
  }
}
