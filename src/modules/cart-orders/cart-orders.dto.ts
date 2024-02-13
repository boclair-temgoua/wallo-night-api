import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CartOrdersDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  cartOrderId: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  organizationSellerId: string;
}
