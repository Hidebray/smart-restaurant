import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

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

  @Get()
  findAll(@Req() req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = this.jwtService.verify(token);
        if (decoded && decoded.role === 'CUSTOMER') {
          return this.ordersService.findAll({ customerId: decoded.sub });
        }
      } catch (e) {
        // Ignore
      }
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
}
