
import {
  IsString,
  IsUUID,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class CartOrdersDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  cartOrderId: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  organizationId: string;
}