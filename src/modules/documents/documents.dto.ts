import { User } from '../../models/User';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsOptional,
  IsUUID,
  IsEmail,
  IsInt,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { DocumentType } from './documents.type';

export class FilterDocumentDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(DocumentType)
  type: DocumentType;

  @IsOptional()
  @IsString()
  @IsUUID()
  organizationId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  projectId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  subProjectId: string;
}

export class CreateDocumentDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
