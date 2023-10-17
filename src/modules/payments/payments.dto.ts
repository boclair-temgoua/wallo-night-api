import { IsString, IsOptional } from 'class-validator';
import { AmountModel } from '../wallets/wallets.type';

export class CreateSubscribePaymentsDto {
  @IsOptional()
  @IsString()
  membershipId: string;

  @IsOptional()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  reference: string;

  @IsOptional()
  paymentMethod: any;

  @IsOptional()
  amount: AmountModel;
}
