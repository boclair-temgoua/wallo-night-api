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
  IsBoolean,
  IsOptional,
  IsIn,
  IsUUID,
} from 'class-validator';

export class CreateOrUpdateCommentsDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  postId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  userReceiveId: string;

  @IsOptional()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(filterQueryTypeArrays)
  model: FilterQueryType;
}

export class CommentsDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  postId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  productId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  commentId: string;

  @IsOptional()
  @IsString()
  userVisitorId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  userReceiveId: string;

  @IsNotEmpty()
  @IsString()
  modelIds: string;
}
