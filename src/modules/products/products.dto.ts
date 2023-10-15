import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsIn,
} from 'class-validator';
import {
  WhoCanSeeType,
  whoCanSeeTypeArrays,
} from '../../app/utils/search-query';

export type StatusProduct = 'ACTIVE' | 'PENDING';

export type ProductType = 'DIGITAL' | 'PHYSICAL';

export const productTypeArrays = ['DIGITAL', 'PHYSICAL'];

export class CreateOrUpdateProductsDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(whoCanSeeTypeArrays)
  whoCanSee: WhoCanSeeType;

  @IsNotEmpty()
  @IsString()
  @IsIn(productTypeArrays)
  productType: ProductType;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  membershipId: string;

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
  organizationId: string;

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
  @IsUUID()
  organizationId: string;

  @IsOptional()
  @IsString()
  typeIds: string;

  @IsOptional()
  @IsString()
  status: string;
}
