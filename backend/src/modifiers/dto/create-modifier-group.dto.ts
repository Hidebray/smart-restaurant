import { IsString, IsBoolean, IsInt, IsOptional, IsIn } from 'class-validator';

export class CreateModifierGroupDto {
  @IsString()
  name: string;

  @IsIn(['SINGLE', 'MULTIPLE'])
  selectionType: string;

  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;

  @IsInt()
  @IsOptional()
  minSelections?: number;

  @IsInt()
  @IsOptional()
  maxSelections?: number;
}
