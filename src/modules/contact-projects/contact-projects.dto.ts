import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsOptional,
  IsUUID,
  IsEmail,
  IsInt,
  IsEnum,
  IsArray,
} from 'class-validator';
import { FilterQueryType } from '../../app/utils/search-query';

export class DeleteMultipleContactProjectsDto {
  @IsNotEmpty()
  @IsArray()
  contactProjects: string[];
}

export class CreateOrUpdateContactProjectsDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(FilterQueryType)
  type: FilterQueryType;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  contactId: string;

  @IsNotEmpty()
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

  @IsOptional()
  @IsString()
  @IsUUID()
  subSubProjectId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  subSubSubProjectId: string;
}

export class ContactProjectsDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(FilterQueryType)
  type: FilterQueryType;

  @IsNotEmpty()
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

  @IsOptional()
  @IsString()
  @IsUUID()
  subSubProjectId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  subSubSubProjectId: string;
}
