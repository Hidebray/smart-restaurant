import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UpdateDiscountDto } from './dto/update-discount.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly jwtService: JwtService
  ) { }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = this.jwtService.verify(token);
        if (decoded && decoded.sub) {
          createOrderDto.customerId = decoded.sub;
        }
      } catch (e) {
        // Ignore invalid tokens for guest orders
      }
    }
    return this.ordersService.create(createOrderDto);
  }

  @Get('my-history')
  async getMyHistory(@Req() req) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('Unauthorized');
    }
    try {
      const token = authHeader.split(' ')[1];
      const decoded = this.jwtService.verify(token);
      if (!decoded || !decoded.sub) {
        throw new Error('Invalid token');
      }
      return this.ordersService.findAll({ customerId: decoded.sub });
    } catch (e) {
      throw new Error('Unauthorized');
    }
  }

  @Get()
  findAll(@Req() req, @Query('tableId') tableId: string) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = this.jwtService.verify(token);
        if (decoded && decoded.role === 'CUSTOMER') {
          return this.ordersService.findAll({ customerId: decoded.sub });
        }
        if (decoded && decoded.role === 'WAITER') {
          return this.ordersService.findAll({ table: { assignedWaiterId: decoded.sub } });
        }
      } catch (e) {
        // Ignore
      }
    }

    if (tableId) {
      return this.ordersService.findAll({ tableId });
    }

    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateStatus(id, status);
  }

  @Patch(':id/discount')
  updateDiscount(@Param('id') id: string, @Body() dto: UpdateDiscountDto) {
    return this.ordersService.updateDiscount(id, dto);
  }

  @Patch('items/:itemId/status')
  updateItemStatus(@Param('itemId') itemId: string, @Body('status') status: string) {
    return this.ordersService.updateItemStatus(itemId, status);
  }
}
