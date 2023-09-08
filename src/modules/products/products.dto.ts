import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsUUID,
  IsOptional,
  IsArray,
  IsInt,
  IsBoolean,
} from 'class-validator';

export type StatusProduct = 'ACTIVE' | 'PENDING';
export class CreateOrUpdateProductsDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  discountId: string;

  @IsOptional()
  @IsString()
  price: string;

  @IsOptional()
  @IsString()
  limitSlot: string;

  @IsOptional()
  @IsString()
  isLimitSlot: string;

  @IsOptional()
  @IsString()
  enableDiscount: string;

  @IsOptional()
  @IsString()
  urlMedia: string;

  @IsOptional()
  @IsString()
  isChooseQuantity: string;

  @IsOptional()
  @IsString()
  messageAfterPayment: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class GetOneProductDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  productId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  productSlug: string;
}
