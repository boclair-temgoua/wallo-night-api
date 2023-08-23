import { User } from '../../models/User';
import { FilterQueryType } from '../../app/utils/search-query/search-query.dto';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsEnum,
  IsOptional,
  IsIn,
  IsUUID,
} from 'class-validator';

export class CreateOrUpdateLikesDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(FilterQueryType)
  type: FilterQueryType;

  @IsOptional()
  @IsString()
  @IsUUID()
  likeableId: string;
}
