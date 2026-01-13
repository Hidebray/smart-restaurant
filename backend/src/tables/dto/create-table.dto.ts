
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTableDto {
  @IsString()
  @IsNotEmpty()
  tableNumber: string;

  @IsInt()
  @IsNotEmpty()
  capacity: number;

  @IsString()
  @IsOptional()
  location?: string;
}
