import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string | null;

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
}
