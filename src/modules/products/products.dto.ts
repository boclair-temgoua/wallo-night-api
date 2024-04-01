import { Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  FilterQueryType,
  WhoCanSeeType,
  filterQueryTypeArrays,
  whoCanSeeTypeArrays,
} from '../../app/utils/search-query';

export type StatusProduct = 'ACTIVE' | 'PENDING';

export type ProductType = 'DIGITAL' | 'PHYSICAL';

export const productTypeArrays = ['DIGITAL', 'PHYSICAL'];

export class CreateOrUpdateProductsDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(filterQueryTypeArrays)
  model?: FilterQueryType;

  @IsNotEmpty()
  @IsString()
  @IsIn(whoCanSeeTypeArrays)
  whoCanSee: WhoCanSeeType;

  @IsOptional()
  @IsString()
  @IsIn(productTypeArrays)
  productType: ProductType;

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
  isVisible: string;

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
  @IsIn(['TRUE', 'FALSE'])
  @Type(() => String)
  isVisible: string;

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
  @IsNotEmpty()
  @IsString()
  modelIds: FilterQueryType[];

  @IsOptional()
  @IsString()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  @IsIn(['TRUE', 'FALSE'])
  @Type(() => String)
  isVisible: string;

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
