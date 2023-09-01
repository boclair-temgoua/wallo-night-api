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

export class CreateOrUpdatePostsGalleriesDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(whoCanSeeTypeArrays)
  whoCanSee: WhoCanSeeType;

  @IsOptional()
  @IsString()
  allowDownload: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(postTypeArrays)
  type: PostType;
}

export class GetGalleriesDto {
  @IsOptional()
  @IsString()
  @IsIn(postTypeArrays)
  type: PostType;
}
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

  @IsNotEmpty()
  @IsString()
  @IsIn(postTypeArrays)
  type: PostType;

  @IsOptional()
  @IsBoolean()
  status: boolean;

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
