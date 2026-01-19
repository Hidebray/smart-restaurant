import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TablesModule } from './tables/tables.module';
import { ModifiersModule } from './modifiers/modifiers.module';
import { ReportsModule } from './reports/reports.module';
import { PaymentsModule } from './payments/payments.module';
import { ReviewsModule } from './reviews/reviews.module';
import { LoyaltyModule } from './loyalty/loyalty.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [
    TablesModule,
    OrdersModule,
    PrismaModule,
    ProductsModule,
    AuthModule,
    UserModule,
    ModifiersModule,
    ReportsModule,
    PaymentsModule,
    ReviewsModule,
    LoyaltyModule,
    InventoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
