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

export class CreateOrUpdateGroupsDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  organizationId: string;

  @IsOptional()
  @IsString()
  description: string;

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

export class GroupsDto {
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
