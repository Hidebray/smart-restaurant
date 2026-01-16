
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import * as qrcode from 'qrcode';
import { randomBytes } from 'crypto';

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) { }

  create(createTableDto: CreateTableDto) {
    return this.prisma.table.create({
      data: createTableDto,
    });
  }

  findAll() {
    return this.prisma.table.findMany();
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

    // Use configurable frontend URL
    const frontendUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/table/${qrToken}`;

    return qrcode.toDataURL(frontendUrl);
  }
}
