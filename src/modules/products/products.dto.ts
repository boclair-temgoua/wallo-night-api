import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsUUID,
  IsOptional,
  IsArray,
  IsInt,
} from 'class-validator';

export type StatusProduct = 'ACTIVE' | 'PENDING';
export class CreateOrUpdateProductsDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title: string;

  // @IsOptional()
  // @IsArray()
  // fileList: any;

  // @IsNotEmpty()
  // @IsString()
  // @IsUUID()
  // categoryId: string;

  // @IsOptional()
  // @IsString()
  // @IsUUID()
  // discountId: string;

  @IsOptional()
  @IsInt()
  price: number;

  @IsOptional()
  @IsString()
  urlMedia: string;

  @IsOptional()
  @IsString()
  messageAfterPurchase: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
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
