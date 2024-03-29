import {
  WhoCanSeeType,
  whoCanSeeTypeArrays,
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
import { PostType, postTypeArrays } from './posts.type';

export class CreateOrUpdatePostsDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(whoCanSeeTypeArrays)
  whoCanSee: WhoCanSeeType;

  @IsOptional()
  @IsString()
  allowDownload: string;

  @IsOptional()
  @IsString()
  urlMedia: string;

  @IsOptional()
  @IsString()
  enableUrlMedia: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(postTypeArrays)
  type: PostType;

  @IsOptional()
  @IsString()
  categories: any[];

  @IsOptional()
  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  description: string;
}

export class GetOnePostDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  postId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  postSlug: string;

  @IsOptional()
  @IsString()
  type: string;
}

export class GetGalleriesDto {
  @IsOptional()
  @IsString()
  @IsIn(postTypeArrays)
  type: PostType;

  @IsOptional()
  @IsString()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  typeIds: string;

  @IsOptional()
  @IsString()
  status: string;
}
