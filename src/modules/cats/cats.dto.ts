import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsUUID,
  IsOptional,
  IsInt,
} from 'class-validator';

export type StatusCart = 'ADDED' | 'COMPLETED';

export class CartsDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  cartOrderId: string;
}

export class CreateOrUpdateCartsDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  productId: string;

  @IsNotEmpty()
  @IsInt()
  quantity: number;
}
