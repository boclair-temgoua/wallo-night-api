import { User } from '../../models/User';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsBoolean,
  IsOptional,
  IsIn,
  IsUUID,
  IsArray,
} from 'class-validator';

export class CreateOrUpdatePostsDto {
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
