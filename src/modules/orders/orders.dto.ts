import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

import {
  FilterQueryType,
  filterQueryTypeArrays,
} from '../../app/utils/search-query';
import {
  OrderItemStatus,
  orderItemStatusArrays,
} from '../order-items/order-items.type';
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

  @IsOptional()
  @IsString()
  @IsUUID()
  userId: string;
}

export class UpdateOrderItemDto {
  @IsOptional()
  @IsString()
  @IsIn(filterQueryTypeArrays)
  model: FilterQueryType;

  @IsOptional()
  @IsString()
  @IsIn(orderItemStatusArrays)
  status: OrderItemStatus;
}
