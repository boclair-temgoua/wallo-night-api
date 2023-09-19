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
  title: string;

  @IsOptional()
  @IsString()
  discountId: string;

  @IsOptional()
  @IsString()
  price: string;

  @IsOptional()
  @IsString()
  urlRedirect: string;

  @IsOptional()
  @IsString()
  enableUrlRedirect: string;

  @IsOptional()
  @IsString()
  limitSlot: string;

  @IsOptional()
  @IsString()
  enableLimitSlot: string;

  @IsOptional()
  @IsString()
  enableDiscount: string;

  @IsOptional()
  @IsString()
  urlMedia: string;

  @IsOptional()
  @IsString()
  enableChooseQuantity: string;

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

export class GetProductsDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  typeIds: string;

  @IsOptional()
  @IsString()
  status: string;
}
