import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsString()
  allergens?: string | null;

  // Prisma Decimal can take string (recommended to avoid float issues)
  @IsNumberString()
  price: string;

  @IsOptional()
  @IsEnum(['AVAILABLE', 'UNAVAILABLE', 'SOLD_OUT'])
  status?: 'AVAILABLE' | 'UNAVAILABLE' | 'SOLD_OUT';

  // To keep Admin UI simple, we accept categoryName and upsert category
  @IsString()
  @IsNotEmpty()
  categoryName: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  imageUrl?: string | null;

  @IsOptional()
  @IsBoolean()
  isChefRecommended?: boolean;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  prepTimeMinutes?: number;
}
