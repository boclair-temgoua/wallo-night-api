import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';
import {
  FilterQueryType,
  filterQueryTypeArrays,
} from '../../app/utils/search-query';

export class FilterTransactionsDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  organizationId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  userBuyerId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  userReceiveId: string;

  @IsOptional()
  @IsString()
  days: string;

  @IsOptional()
  @IsString()
  @IsIn(filterQueryTypeArrays)
  model: FilterQueryType;
}
