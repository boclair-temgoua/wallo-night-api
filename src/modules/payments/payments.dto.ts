import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { AmountModel } from '../wallets/wallets.type';

export class CreateSubscribePaymentsDto {
  @IsOptional()
  @IsString()
  membershipId: string;

  @IsOptional()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  organizationId: string;

  @IsOptional()
  @IsString()
  reference: string;

  @IsOptional()
  paymentMethod: any;

  @IsOptional()
  amount: AmountModel;
}
