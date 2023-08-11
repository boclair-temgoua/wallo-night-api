import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  MinLength,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { WhoCanSeeType } from '../../app/utils/search-query/search-query.dto';

export class CreateOrUpdateGalleriesDto {
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
  allowDownload: boolean;

  @IsOptional()
  @IsString()
  description: string;
}
