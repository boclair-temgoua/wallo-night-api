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
export class CreateOrUpdateContactsDto {
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
  description: string;
}

export class DeleteMultipleContactsDto {
  @IsNotEmpty()
  @IsArray()
  contacts: string[];
}
