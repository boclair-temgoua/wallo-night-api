import { User } from '../../models/User';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsIn,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateOrUpdateUserAddressDto {
  @IsOptional()
  @IsString()
  company: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  region: string;

  @IsOptional()
  @IsString()
  street1: string;

  @IsOptional()
  @IsString()
  street2: string;

  @IsOptional()
  @IsString()
  cap: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  countryId: string;
}
