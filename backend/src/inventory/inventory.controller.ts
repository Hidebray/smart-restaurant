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
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { CreateInventoryTransactionDto } from './dto/inventory-transaction.dto';

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  /**
   * Get all inventory items
   * GET /inventory
   */
  @Get()
  findAll(@Query('includeLowStock') includeLowStock?: string) {
    return this.inventoryService.findAll(includeLowStock === 'true');
  }

  /**
   * Get inventory by product ID
   * GET /inventory/product/:productId
   */
  @Get('product/:productId')
  findByProductId(@Param('productId') productId: string) {
    return this.inventoryService.findByProductId(productId);
  }

  /**
   * Get low stock alerts
   * GET /inventory/alerts
   */
  @Get('alerts')
  getLowStockAlerts() {
    return this.inventoryService.getLowStockAlerts();
  }

  /**
   * Get inventory statistics
   * GET /inventory/stats
   */
  @Get('stats')
  getStats() {
    return this.inventoryService.getStats();
  }

  /**
   * Create inventory for a product
   * POST /inventory
   */
  @Post()
  create(@Body() dto: CreateInventoryDto) {
    return this.inventoryService.create(dto);
  }

  /**
   * Update inventory
   * PATCH /inventory/:id
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateInventoryDto) {
    return this.inventoryService.update(id, dto);
  }

  /**
   * Delete inventory
   * DELETE /inventory/:id
   */
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.inventoryService.delete(id);
  }

  /**
   * Restock inventory
   * POST /inventory/:id/restock
   */
  @Post(':id/restock')
  restock(
    @Param('id') id: string,
    @Body() body: { quantity: number; reason?: string },
  ) {
    return this.inventoryService.restock(id, body.quantity, body.reason);
  }

  /**
   * Adjust inventory (manual correction)
   * POST /inventory/:id/adjust
   */
  @Post(':id/adjust')
  adjust(
    @Param('id') id: string,
    @Body() body: { quantity: number; reason?: string },
  ) {
    return this.inventoryService.adjust(id, body.quantity, body.reason);
  }

  /**
   * Get transaction history
   * GET /inventory/:id/transactions
   */
  @Get(':id/transactions')
  getTransactionHistory(
    @Param('id') id: string,
    @Query('limit') limit?: string,
  ) {
    return this.inventoryService.getTransactionHistory(
      id,
      limit ? parseInt(limit, 10) : 50,
    );
  }

  /**
   * Create inventory transaction
   * POST /inventory/transactions
   */
  @Post('transactions')
  createTransaction(@Body() dto: CreateInventoryTransactionDto) {
    return this.inventoryService.createTransaction(dto);
  }
}
