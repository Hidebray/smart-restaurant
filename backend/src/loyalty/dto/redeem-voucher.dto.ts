import { IsString, IsUUID } from 'class-validator';

export class RedeemVoucherDto {
  @IsString()
  code: string; // Voucher code

  @IsString()
  @IsUUID()
  orderId: string; // Order to apply voucher to
}
