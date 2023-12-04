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
import { ProductStatus } from '../../app/utils/pagination';

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
  categoryId: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
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

  @IsOptional()
  @IsString()
  enableUrlMedia: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(postTypeArrays)
  type: PostType;

  @IsOptional()
  @IsString()
  status: ProductStatus;

  @IsOptional()
  @IsString()
  categoryId: string;

  @IsOptional()
  @IsString()
  albumId: string;

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
  organizationId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  userVisitorId: string;

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
  organizationId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  categoryId: string

  @IsOptional()
  @IsString()
  @IsUUID()
  albumId: string

  @IsOptional()
  @IsString()
  @IsUUID()
  userVisitorId: string;

  @IsOptional()
  @IsString()
  typeIds: string;

  @IsOptional()
  @IsString()
  status: string;
}
