import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsUUID,
  IsOptional,
  IsInt,
} from 'class-validator';

export enum StatusCart {
  ADDED = 'ADDED',
  COMPLETED = 'COMPLETED',
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
