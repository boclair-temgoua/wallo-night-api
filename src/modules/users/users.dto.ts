import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Match } from '../../app/utils/decorators';

export type UserPermission = 'ADMIN' | 'USER';

export const userPermissionArrays = ['ADMIN', 'MODERATOR'];

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
  @MaxLength(50)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  lastName: string;

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
  firstName: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  username: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  countryId: string;

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
  username: string;
}

export class CreateOrUpdateResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @IsEmail()
  email: string;
}
