import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { MaxLength, IsEmail } from 'class-validator';
import { FilterQueryType } from '../../app/utils/search-query';

export class UpdateOrganizationDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(50)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstAddress: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  secondAddress: string;
}
