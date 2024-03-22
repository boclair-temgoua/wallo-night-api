import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  FilterQueryType,
  filterQueryTypeArrays,
} from '../../app/utils/search-query';

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
