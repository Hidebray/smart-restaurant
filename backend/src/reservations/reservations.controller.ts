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
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { GetReservationsDto } from './dto/get-reservations.dto';

@Controller('reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  /**
   * Create a new reservation
   * POST /reservations
   */
  @Post()
  @Roles(UserRole.ADMIN, UserRole.WAITER, UserRole.CUSTOMER)
  create(@Body() dto: CreateReservationDto) {
    return this.reservationsService.create(dto);
  }

  /**
   * Get all reservations with filters
   * GET /reservations
   */
  @Get()
  @Roles(UserRole.ADMIN, UserRole.WAITER, UserRole.CUSTOMER)
  findAll(@Query() query: GetReservationsDto) {
    return this.reservationsService.findAll(query);
  }

  /**
   * Get reservation by ID
   * GET /reservations/:id
   */
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.WAITER, UserRole.CUSTOMER)
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  /**
   * Update reservation
   * PATCH /reservations/:id
   */
  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.WAITER)
  update(@Param('id') id: string, @Body() dto: UpdateReservationDto) {
    return this.reservationsService.update(id, dto);
  }

  /**
   * Delete reservation
   * DELETE /reservations/:id
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.WAITER)
  delete(@Param('id') id: string) {
    return this.reservationsService.delete(id);
  }

  /**
   * Confirm reservation
   * PATCH /reservations/:id/confirm
   */
  @Patch(':id/confirm')
  @Roles(UserRole.ADMIN, UserRole.WAITER)
  confirm(@Param('id') id: string) {
    return this.reservationsService.confirm(id);
  }

  /**
   * Cancel reservation
   * PATCH /reservations/:id/cancel
   */
  @Patch(':id/cancel')
  @Roles(UserRole.ADMIN, UserRole.WAITER, UserRole.CUSTOMER)
  cancel(@Param('id') id: string, @Body() body: { reason?: string }) {
    return this.reservationsService.cancel(id, body.reason);
  }

  /**
   * Complete reservation
   * PATCH /reservations/:id/complete
   */
  @Patch(':id/complete')
  @Roles(UserRole.ADMIN, UserRole.WAITER)
  complete(@Param('id') id: string) {
    return this.reservationsService.complete(id);
  }

  /**
   * Mark reservation as no-show
   * PATCH /reservations/:id/no-show
   */
  @Patch(':id/no-show')
  @Roles(UserRole.ADMIN, UserRole.WAITER)
  markNoShow(@Param('id') id: string) {
    return this.reservationsService.markNoShow(id);
  }

  /**
   * Get reservations for a specific date
   * GET /reservations/date/:date
   */
  @Get('date/:date')
  @Roles(UserRole.ADMIN, UserRole.WAITER)
  getByDate(@Param('date') date: string) {
    return this.reservationsService.getByDate(new Date(date));
  }

  /**
   * Get upcoming reservations
   * GET /reservations/upcoming
   */
  @Get('upcoming')
  @Roles(UserRole.ADMIN, UserRole.WAITER)
  getUpcoming(@Query('limit') limit?: string) {
    return this.reservationsService.getUpcoming(limit ? parseInt(limit, 10) : 10);
  }

  /**
   * Get reservation statistics
   * GET /reservations/stats
   */
  @Get('stats')
  @Roles(UserRole.ADMIN)
  getStats() {
    return this.reservationsService.getStats();
  }
}
