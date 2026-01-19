import { IsOptional, IsString, IsIn } from 'class-validator';

export class RevenueQueryDto {
  @IsOptional()
  @IsString()
  from?: string; // yyyy-mm-dd or ISO

  @IsOptional()
  @IsString()
  to?: string;

  @IsOptional()
  @IsIn(['day', 'week', 'month'])
  groupBy?: 'day' | 'week' | 'month';

  @IsOptional()
  @IsString()
  take?: string; // optional for top products
}
