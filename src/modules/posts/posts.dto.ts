import { User } from '../../models/User';
import { WhoCanSeeType } from '../../app/utils/search-query/search-query.dto';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsBoolean,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { PostType } from './posts.type';

export class CreateOrUpdatePostsGalleriesDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(WhoCanSeeType)
  whoCanSee: WhoCanSeeType;

  @IsOptional()
  @IsString()
  allowDownload: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(PostType)
  type: PostType;
}

export class GetGalleriesDto {
  @IsOptional()
  @IsString()
  @IsEnum(PostType)
  type: PostType;
}
export class CreateOrUpdatePostsDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(WhoCanSeeType)
  whoCanSee: WhoCanSeeType;

  @IsNotEmpty()
  @IsString()
  @IsEnum(PostType)
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
