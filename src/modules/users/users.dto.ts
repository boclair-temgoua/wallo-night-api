import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Match } from '../../app/utils/decorators';

export class TokenUserDto {
  @IsNotEmpty()
  @MinLength(6)
  @IsString()
  token: string;
}

export class UpdateResetPasswordUserDto {
  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  oldPassword: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password: string;

  @IsString()
  @MinLength(8)
  @Match('password')
  passwordConfirm: string;
}

export class PasswordUpdatedDto {
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(8)
  @IsString()
  password: string;

  @IsString()
  @MaxLength(100)
  @MinLength(8)
  @Match('password')
  passwordConfirm: string;
}

export class CreateLoginUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password: string;
}

export class PasswordResetDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @IsEmail()
  email: string;
}

export class CreateRegisterUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(6)
  code: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  lastName: string;

  @IsOptional()
  @IsString()
  codeVoucher: string;

  @IsOptional()
  @IsString()
  ipLocation: string;

  @IsOptional()
  @IsString()
  userAgent: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password: string;
}

export class UpdateOneEmailUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password: string;
}

export class UpdateProfileDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  username: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstName: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  countryId: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  currencyId: string;

  @IsOptional()
  @IsString()
  birthday: Date;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  firstAddress: string;

  @IsOptional()
  @IsString()
  secondAddress: string;

  @IsOptional()
  @IsString()
  color: string;

  @IsOptional()
  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  image: string;
}
export class GetOneUserDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  userVisitorId: string;

  @IsOptional()
  @IsString()
  username: string;
}

export class SendCodePhoneUserDto {
  @IsNotEmpty()
  @IsString()
  phone: string;
}

export class SendCodeEmailUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @IsEmail()
  email: string;
}

export class LoginPhoneUserDto {
  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(6)
  code: string;
}

export class UpdateEnableProfileDto {
  @IsOptional()
  @IsString()
  enableGallery: string;

  @IsOptional()
  @IsString()
  enableShop: string;

  @IsOptional()
  @IsString()
  enableCommission: string;
}
