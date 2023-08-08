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
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  title: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(WhoCanSeeType)
  whoCanSee: WhoCanSeeType;

  @IsNotEmpty()
  @IsBoolean()
  allowDownload: boolean;

  @IsOptional()
  @IsString()
  description: string;
}
