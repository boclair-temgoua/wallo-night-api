import { WhoCanSeeType, whoCanSeeTypeArrays } from '../../app/utils/search-query/search-query.dto';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsBoolean,
  IsOptional,
  IsIn,
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

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
