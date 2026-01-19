import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, ReservationStatus } from '@prisma/client';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { GetReservationsDto } from './dto/get-reservations.dto';

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new reservation
   */
  async create(dto: CreateReservationDto) {
    // Validate table exists and is available
    const table = await this.prisma.table.findUnique({
      where: { id: dto.tableId },
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    // Check if table capacity is sufficient
    if (dto.guestCount && dto.guestCount > table.capacity) {
      throw new BadRequestException(
        `Table capacity (${table.capacity}) is less than guest count (${dto.guestCount})`,
      );
    }

    // Parse dates
    const reservationDate = new Date(dto.reservationDate);
    const reservationTime = new Date(dto.reservationTime);
    const endTime = new Date(reservationTime.getTime() + (dto.duration || 120) * 60000);

    // Check for overlapping reservations
    const overlapping = await this.checkOverlappingReservations(
      dto.tableId,
      reservationTime,
      endTime,
    );

    if (overlapping.length > 0) {
      throw new ConflictException(
        'Table is already reserved for this time slot',
      );
    }

    // Create reservation
    return this.prisma.reservation.create({
      data: {
        tableId: dto.tableId,
        customerId: dto.customerId,
        guestName: dto.guestName,
        guestPhone: dto.guestPhone,
        guestEmail: dto.guestEmail,
        reservationDate,
        reservationTime,
        duration: dto.duration || 120,
        guestCount: dto.guestCount || 2,
        specialRequests: dto.specialRequests,
        notes: dto.notes,
        status: ReservationStatus.PENDING,
      },
      include: {
        table: {
          select: {
            id: true,
            tableNumber: true,
            capacity: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Get all reservations with filters
   */
  async findAll(dto: GetReservationsDto) {
    const where: Prisma.ReservationWhereInput = {};

    if (dto.tableId) {
      where.tableId = dto.tableId;
    }

    if (dto.customerId) {
      where.customerId = dto.customerId;
    }

    if (dto.date) {
      const date = new Date(dto.date);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      where.reservationDate = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    if (dto.status) {
      where.status = dto.status;
    }

    return this.prisma.reservation.findMany({
      where,
      include: {
        table: {
          select: {
            id: true,
            tableNumber: true,
            capacity: true,
            status: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [
        { reservationDate: 'asc' },
        { reservationTime: 'asc' },
      ],
      skip: dto.skip,
      take: dto.take || 50,
    });
  }

  /**
   * Get reservation by ID
   */
  async findOne(id: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        table: {
          select: {
            id: true,
            tableNumber: true,
            capacity: true,
            status: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return reservation;
  }

  /**
   * Update reservation
   */
  async update(id: string, dto: UpdateReservationDto) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    // If updating time/date, check for conflicts
    if (dto.reservationTime || dto.reservationDate) {
      const reservationTime = dto.reservationTime
        ? new Date(dto.reservationTime)
        : reservation.reservationTime;
      const duration = dto.duration || reservation.duration;
      const endTime = new Date(
        reservationTime.getTime() + duration * 60000,
      );

      const tableId = dto.tableId || reservation.tableId;

      const overlapping = await this.checkOverlappingReservations(
        tableId,
        reservationTime,
        endTime,
        id, // Exclude current reservation
      );

      if (overlapping.length > 0) {
        throw new ConflictException(
          'Table is already reserved for this time slot',
        );
      }
    }

    // Update status timestamps
    const updateData: Prisma.ReservationUpdateInput = {
      ...(dto.guestName && { guestName: dto.guestName }),
      ...(dto.guestPhone && { guestPhone: dto.guestPhone }),
      ...(dto.guestEmail !== undefined && { guestEmail: dto.guestEmail }),
      ...(dto.reservationDate && {
        reservationDate: new Date(dto.reservationDate),
      }),
      ...(dto.reservationTime && {
        reservationTime: new Date(dto.reservationTime),
      }),
      ...(dto.duration !== undefined && { duration: dto.duration }),
      ...(dto.guestCount !== undefined && { guestCount: dto.guestCount }),
      ...(dto.specialRequests !== undefined && {
        specialRequests: dto.specialRequests,
      }),
      ...(dto.notes !== undefined && { notes: dto.notes }),
      ...(dto.tableId && { tableId: dto.tableId }),
      ...(dto.customerId !== undefined && { customerId: dto.customerId }),
    };

    // Handle status changes
    if (dto.status && dto.status !== reservation.status) {
      updateData.status = dto.status;

      if (dto.status === ReservationStatus.CONFIRMED && !reservation.confirmedAt) {
        updateData.confirmedAt = new Date();
      } else if (dto.status === ReservationStatus.CANCELLED && !reservation.cancelledAt) {
        updateData.cancelledAt = new Date();
      } else if (dto.status === ReservationStatus.COMPLETED && !reservation.completedAt) {
        updateData.completedAt = new Date();
      }
    }

    return this.prisma.reservation.update({
      where: { id },
      data: updateData,
      include: {
        table: {
          select: {
            id: true,
            tableNumber: true,
            capacity: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Delete reservation
   */
  async delete(id: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return this.prisma.reservation.delete({
      where: { id },
    });
  }

  /**
   * Confirm reservation
   */
  async confirm(id: string) {
    return this.update(id, {
      status: ReservationStatus.CONFIRMED,
    });
  }

  /**
   * Cancel reservation
   */
  async cancel(id: string, reason?: string) {
    return this.update(id, {
      status: ReservationStatus.CANCELLED,
      notes: reason
        ? `${reservation.notes || ''}\nCancelled: ${reason}`.trim()
        : reservation.notes,
    });
  }

  /**
   * Mark reservation as completed
   */
  async complete(id: string) {
    return this.update(id, {
      status: ReservationStatus.COMPLETED,
    });
  }

  /**
   * Mark reservation as no-show
   */
  async markNoShow(id: string) {
    return this.update(id, {
      status: ReservationStatus.NO_SHOW,
    });
  }

  /**
   * Get reservations for a specific date
   */
  async getByDate(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.prisma.reservation.findMany({
      where: {
        reservationDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          not: ReservationStatus.CANCELLED,
        },
      },
      include: {
        table: {
          select: {
            id: true,
            tableNumber: true,
            capacity: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { reservationTime: 'asc' },
    });
  }

  /**
   * Get upcoming reservations
   */
  async getUpcoming(limit = 10) {
    const now = new Date();

    return this.prisma.reservation.findMany({
      where: {
        reservationTime: {
          gte: now,
        },
        status: {
          in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED],
        },
      },
      include: {
        table: {
          select: {
            id: true,
            tableNumber: true,
            capacity: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { reservationTime: 'asc' },
      take: limit,
    });
  }

  /**
   * Check for overlapping reservations
   */
  private async checkOverlappingReservations(
    tableId: string,
    startTime: Date,
    endTime: Date,
    excludeReservationId?: string,
  ) {
    // Get all active reservations for this table
    const existingReservations = await this.prisma.reservation.findMany({
      where: {
        tableId,
        status: {
          not: ReservationStatus.CANCELLED,
        },
        ...(excludeReservationId && { id: { not: excludeReservationId } }),
      },
    });

    // Check for overlaps
    return existingReservations.filter((res) => {
      const resStart = res.reservationTime;
      const resEnd = new Date(
        resStart.getTime() + res.duration * 60000,
      );

      // Check if there's any overlap
      return (
        (startTime >= resStart && startTime < resEnd) ||
        (endTime > resStart && endTime <= resEnd) ||
        (startTime <= resStart && endTime >= resEnd)
      );
    });
  }

  /**
   * Get reservation statistics
   */
  async getStats() {
    const [total, pending, confirmed, cancelled, completed, noShow] =
      await Promise.all([
        this.prisma.reservation.count(),
        this.prisma.reservation.count({
          where: { status: ReservationStatus.PENDING },
        }),
        this.prisma.reservation.count({
          where: { status: ReservationStatus.CONFIRMED },
        }),
        this.prisma.reservation.count({
          where: { status: ReservationStatus.CANCELLED },
        }),
        this.prisma.reservation.count({
          where: { status: ReservationStatus.COMPLETED },
        }),
        this.prisma.reservation.count({
          where: { status: ReservationStatus.NO_SHOW },
        }),
      ]);

    return {
      total,
      pending,
      confirmed,
      cancelled,
      completed,
      noShow,
    };
  }
}
