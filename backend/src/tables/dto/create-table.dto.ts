
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

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

  @IsOptional()
  @IsUUID()
  assignedWaiterId?: string;
}
