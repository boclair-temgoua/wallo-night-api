import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
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

export enum FilterQueryType {
  ORGANIZATION = 'ORGANIZATION',
  PROJECT = 'PROJECT',
  SUBPROJECT = 'SUBPROJECT',
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
