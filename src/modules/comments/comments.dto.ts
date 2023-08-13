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
} from 'class-validator';

export class CreateOrUpdateCommentsDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  galleryId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  postId: string;
}

export class CommentsDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  galleryId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  postId: string;
}
