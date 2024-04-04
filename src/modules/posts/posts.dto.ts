import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ProductStatus } from '../../app/utils/pagination';
import {
  WhoCanSeeType,
  whoCanSeeTypeArrays,
} from '../../app/utils/search-query';
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
  enableVisibility: string;

  @IsOptional()
  @IsString()
  categoryId: string;

  @IsOptional()
  @IsString()
  albumId: string;

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

  @IsOptional()
  @IsString()
  enableVisibility: string;

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
  categoryId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  albumId: string;

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
