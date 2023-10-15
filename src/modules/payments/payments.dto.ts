import { IsString, IsOptional } from 'class-validator';

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
  amount: { value: number; month: number; currency: string };
}
