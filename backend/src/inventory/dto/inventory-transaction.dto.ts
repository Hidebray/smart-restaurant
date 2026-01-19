import { IsString, IsInt, IsEnum, IsOptional, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { InventoryTransactionType } from '@prisma/client';

export class CreateInventoryTransactionDto {
  @IsString()
  @IsUUID()
  inventoryId: string;

  @Type(() => Number)
  @IsInt()
  quantity: number; // Positive for IN, negative for OUT

  @IsEnum(InventoryTransactionType)
  type: InventoryTransactionType;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  orderId?: string;
}
