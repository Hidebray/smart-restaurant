import { IsString, IsNumber, IsUUID } from 'class-validator';

export class CreateModifierOptionDto {
  @IsString()
  name: string;

  @IsNumber()
  priceAdjustment: number;

  @IsUUID()
  groupId: string;
}
