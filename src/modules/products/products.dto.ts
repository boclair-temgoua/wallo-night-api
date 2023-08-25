import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsUUID,
  IsOptional,
  IsArray,
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

  // @IsNotEmpty()
  // @IsInt()
  // price: number;

  // @IsNotEmpty()
  // @IsInt()
  // inventory: number;

  // @IsNotEmpty()
  // @IsString()
  // @MaxLength(100)
  // description: string;
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
