import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

import {
  FilterQueryType,
  filterQueryTypeArrays,
} from '../../app/utils/search-query';
export type StatusOderProduct = 'ORDERED' | 'DELIVERING';

export class GetOrderItemDto {
  @IsOptional()
  @IsString()
  @IsIn(filterQueryTypeArrays)
  model: FilterQueryType;

  @IsOptional()
  @IsString()
  @IsUUID()
  organizationBeyerId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  organizationSellerId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  orderId: string;
}
