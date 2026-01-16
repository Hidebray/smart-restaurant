import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TablesModule } from './tables/tables.module';
import { ModifiersModule } from './modifiers/modifiers.module';

@Module({
  imports: [
    TablesModule,
    OrdersModule,
    PrismaModule,
    ProductsModule,
    AuthModule,
    UserModule,
    ModifiersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
