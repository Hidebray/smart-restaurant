import { IsIn, IsOptional } from 'class-validator';

export class AdminProductsQueryDto {
  @IsOptional()
  @IsIn(['createdAt', 'price', 'name', 'popularity'])
  sortBy?: 'createdAt' | 'price' | 'name' | 'popularity';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortDir?: 'asc' | 'desc';
}
