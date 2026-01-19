import { IsEnum, IsOptional } from 'class-validator';
import { LoyaltyTier } from '@prisma/client';

export class UpdateTierDto {
  @IsOptional()
  @IsEnum(LoyaltyTier)
  tier?: LoyaltyTier;
}
