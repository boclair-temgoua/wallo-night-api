import { IsString, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';
import { AmountModel } from '../wallets/wallets.type';

export class CreateSubscribePaymentsDto {
  @IsOptional()
  @IsString()
  membershipId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  userReceiveId: string;

  @IsOptional()
  @IsString()
  userSendId: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  organizationId: string;

  @IsOptional()
  @IsString()
  reference: string;

  @IsOptional()
  paymentMethod: any;

  @IsOptional()
  amount: AmountModel;
}
