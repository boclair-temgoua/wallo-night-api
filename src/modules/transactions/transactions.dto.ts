import {
  FilterQueryType,
  filterQueryTypeArrays,
} from '../../app/utils/search-query/search-query.dto';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsUUID,
  IsOptional,
  IsInt,
  IsIn,
} from 'class-validator';

export class FilterTransactionsDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  campaignId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  userSendId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  userReceiveId: string;

  @IsOptional()
  @IsString()
  @IsIn(filterQueryTypeArrays)
  model: FilterQueryType;
}
