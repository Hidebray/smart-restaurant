
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import * as qrcode from 'qrcode';
import { randomBytes } from 'crypto';

import { OrdersGateway } from 'src/events/orders.gateway';

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService, private ordersGateway: OrdersGateway) { }

  create(createTableDto: CreateTableDto) {
    return this.prisma.table.create({
      data: createTableDto,
    });
  }

  findAll(waiterId?: string) {
    const where = waiterId ? { assignedWaiterId: waiterId } : {};
    return this.prisma.table.findMany({
      where,
      include: {
        assignedWaiter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.table.findUnique({ where: { id } });
  }

  update(id: string, updateTableDto: UpdateTableDto) {
    return this.prisma.table.update({
      where: { id },
      data: updateTableDto,
    });
  }

  async remove(id: string) {
    // Check if table has any orders (including completed ones)
    const ordersCount = await this.prisma.order.count({
      where: { tableId: id },
    });

    if (ordersCount > 0) {
      // Instead of deleting, set table to INACTIVE to preserve order history
      return this.prisma.table.update({
        where: { id },
        data: { status: 'INACTIVE' },
      });
    }

    // No orders - safe to delete
    return this.prisma.table.delete({ where: { id } });
  }

  async findByQrToken(token: string) {
    const table = await this.prisma.table.findUnique({
      where: { qrToken: token },
    });
    if (!table) throw new NotFoundException('Invalid QR Token');
    return table;
  }

  async generateQrCode(id: string): Promise<string> {
    const table = await this.prisma.table.findUnique({ where: { id } });

    if (!table) {
      throw new NotFoundException(`Table with ID ${id} not found`);
    }

    let qrToken = table.qrToken;
    if (!qrToken) {
      qrToken = randomBytes(16).toString('hex');
      await this.prisma.table.update({
        where: { id },
        data: {
          qrToken,
          qrTokenCreatedAt: new Date(),
        },
      });
    }

    // Use token instead of ID for secure/regeneratable QR codes
    const frontendUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/guest?token=${qrToken}`;

    return qrcode.toDataURL(frontendUrl);
  }

  async regenerateQrToken(id: string): Promise<string> {
    const table = await this.prisma.table.findUnique({ where: { id } });
    if (!table) throw new NotFoundException(`Table with ID ${id} not found`);

    const newQrToken = randomBytes(16).toString('hex');
    await this.prisma.table.update({
      where: { id },
      data: {
        qrToken: newQrToken,
        qrTokenCreatedAt: new Date(),
      },
    });

    // Return the new QR Code image
    const frontendUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/guest?token=${newQrToken}`;
    return qrcode.toDataURL(frontendUrl);
  }

  async requestAssistance(id: string, type: 'PAYMENT_CASH' | 'PAYMENT_QR' | 'ASSISTANCE') {
    const table = await this.prisma.table.findUnique({ where: { id } });
    if (!table) throw new NotFoundException('Table not found');

    const payload = {
      tableId: table.id,
      tableName: table.tableNumber,
      type,
      timestamp: new Date(),
    };

    this.ordersGateway.emitTableNotification(payload);
    return { success: true };
  }

  async assignWaiter(tableId: string, waiterId: string | null) {
    const table = await this.prisma.table.findUnique({ where: { id: tableId } });
    if (!table) throw new NotFoundException('Table not found');

    if (waiterId) {
      // Verify waiter exists and has WAITER role
      const waiter = await this.prisma.user.findUnique({
        where: { id: waiterId },
      });
      if (!waiter || waiter.role !== 'WAITER') {
        throw new BadRequestException('Invalid waiter ID or user is not a waiter');
      }
    }

    return this.prisma.table.update({
      where: { id: tableId },
      data: { assignedWaiterId: waiterId },
      include: {
        assignedWaiter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}
