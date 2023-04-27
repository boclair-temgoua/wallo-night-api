import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  NotEquals,
  ValidateIf,
} from 'class-validator';
export class SearchQueryDto {
  @IsString()
  @IsOptional()
  @NotEquals(null)
  @NotEquals('')
  @ValidateIf((object, value) => value !== undefined)
  search?: string;
}
export class PasswordBodyDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(8)
  password: string;
}

export enum FilterQueryType {
  POST = 'POST',
  GROUP = 'GROUP',
  ORGANIZATION = 'ORGANIZATION',
  PROJECT = 'PROJECT',
  SUBPROJECT = 'SUBPROJECT',
  SUBSUBPROJECT = 'SUBSUBPROJECT',
  SUBSUBSUBPROJECT = 'SUBSUBSUBPROJECT',
}
export class FilterQueryTypeDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(FilterQueryType)
  type: FilterQueryType;

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
