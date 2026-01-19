import { IsString, IsInt, IsOptional, IsUUID, IsEmail, IsDateString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReservationDto {
  @IsString()
  @IsUUID()
  tableId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  customerId?: string;

  @IsString()
  guestName: string;

  @IsString()
  guestPhone: string;

  @IsOptional()
  @IsEmail()
  guestEmail?: string;

  @IsDateString()
  reservationDate: string; // ISO date string

  @IsDateString()
  reservationTime: string; // ISO datetime string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(30)
  @Max(480)
  duration?: number = 120; // Default 2 hours

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  guestCount?: number = 2;

  @IsOptional()
  @IsString()
  specialRequests?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
