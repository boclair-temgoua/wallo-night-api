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
export class CreateOrUpdateContactsDto {
  @IsOptional()
  @IsString()
  @IsEnum(FilterQueryType)
  type: FilterQueryType;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  categoryId: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  organizationId: string;

  @IsOptional()
  @IsInt()
  countryId: number;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  address: string;

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
  description: string;
}

export class DeleteMultipleContactsDto {
  @IsNotEmpty()
  @IsArray()
  contacts: string[];
}
