import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OrdersGateway } from 'src/events/orders.gateway';

import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersGateway],
})
export class OrdersModule { }
