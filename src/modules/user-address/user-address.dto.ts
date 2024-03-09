import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateOrUpdateUserAddressDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  firstName: string;

  @IsNotEmpty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  city: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  cap: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  country: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  phone: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  region: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  street1: string;

  @IsOptional()
  @IsString()
  street2: string;
}
