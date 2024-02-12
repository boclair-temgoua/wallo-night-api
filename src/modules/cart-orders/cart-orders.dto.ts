import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CartOrdersDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  cartOrderId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  organizationId: string;
}
