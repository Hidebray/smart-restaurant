import { IsString, IsArray, ValidateNested, IsUUID, IsInt, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
    @IsString()
    productId: string;

    @IsInt()
    @Min(1)
    quantity: number;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ModifierDto)
    modifiers?: ModifierDto[];
}

class ModifierDto {
    @IsString()
    @IsUUID(4)
    modifierOptionId: string;
}

export class CreateOrderDto {
    @IsString()
    @IsUUID(4)
    tableId: string;

    @IsOptional()
    @IsString()
    @IsUUID(4)
    customerId?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];
}
