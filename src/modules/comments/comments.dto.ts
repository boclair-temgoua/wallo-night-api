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
  postId: string;

  @IsOptional()
  @IsString()
  productId: string;
}

export class CommentsDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  postId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  productId: string;
  
  @IsOptional()
  @IsString()
  @IsUUID()
  commentId: string;

  @IsOptional()
  @IsString()
  userVisitorId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  userId: string;
}
