import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsBoolean,
  IsOptional,
  IsIn,
  IsUUID,
  IsEnum,
} from 'class-validator';
export class CreateOrUpdateGroupsDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  name: string;

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

  @IsOptional()
  @IsString()
  @IsUUID()
  subSubProjectId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  subSubSubProjectId: string;
}
