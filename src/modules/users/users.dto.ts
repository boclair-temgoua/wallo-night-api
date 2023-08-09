import {
  IsString,
  MaxLength,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsInt,
  IsOptional,
  IsUUID,
  IsEnum,
  IsDate,
} from 'class-validator';
import { Match } from '../../app/utils/decorators';
import { NextStep } from './users.type';
export class UpdateInfoUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @IsEmail()
  email?: string;

  @IsOptional()
  user: any;
}

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
  password: string;

  @IsString()
  @MinLength(8)
  @Match('password')
  passwordConfirm: string;
}

export class UpdateEmailUserDto {
  @IsNotEmpty()
  @MaxLength(200)
  @IsEmail()
  @IsString()
  newEmail: string;

  @IsNotEmpty()
  @MaxLength(200)
  @MinLength(8)
  passwordConfirm: string;

  @IsOptional()
  user: any;
}
export class UpdateChangePasswordUserDto {
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(8)
  @IsString()
  password: string;

  @IsString()
  @MaxLength(100)
  @MinLength(8)
  newPassword: string;

  @IsString()
  @MaxLength(100)
  @MinLength(8)
  @Match('newPassword')
  passwordConfirm: string;

  @IsOptional()
  @IsInt()
  userId: number;
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

  @IsOptional()
  @IsString()
  ipLocation: string;
}

export class CreateRegisterUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(NextStep)
  nextStep: NextStep;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  fullName: string;

  @IsOptional()
  @IsString()
  codeVoucher: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  ipLocation: string;

  @IsOptional()
  @IsString()
  userAgent: string;

  @IsOptional()
  @IsString()
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password: string;

  // @IsString()
  // @MinLength(8)
  // @Match('password')
  // passwordConfirm: string;
}

export class ConfirmOneRegisterCreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  fullName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  token: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password: string;

  @IsString()
  @MinLength(8)
  @Match('password')
  passwordConfirm: string;
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
  @IsOptional()
  @IsString()
  @MaxLength(50)
  fullName: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  username: string;

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
  @IsEnum(NextStep)
  nextStep: NextStep;

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
  username: string;
}
