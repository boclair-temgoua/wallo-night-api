import { User } from '../../models/User';
import {
  FilterQueryType,
  filterQueryTypeArrays,
} from '../../app/utils/search-query/search-query.dto';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsOptional,
  IsIn,
  IsUUID,
} from 'class-validator';

export class CreateOrUpdateLikesDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(filterQueryTypeArrays)
  type: FilterQueryType;

  @IsOptional()
  @IsString()
  @IsUUID()
  likeableId: string;
}
