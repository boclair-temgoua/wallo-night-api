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

export class CreateOrUpdateCommentsDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  organizationId: string;

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
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  organizationId: string;

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
