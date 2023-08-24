import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsUUID,
  IsOptional,
  IsInt,
} from 'class-validator';

export type StatusProduct = 'ACTIVE' | 'PENDING'
export class CreateOrUpdateProductsDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  discountId: string;

  @IsNotEmpty()
  @IsInt()
  price: number;

  @IsNotEmpty()
  @IsInt()
  inventory: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  description: string;
}
