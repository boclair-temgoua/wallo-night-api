import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { ContributorRole, ContributorType } from './contributors.type';
import { MaxLength, IsEmail } from 'class-validator';

export class CreateOneContributorProjectDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  projectId: string;
}

export class UpdateRoleContributorDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  contributorId: string;

  @IsOptional()
  @IsString()
  @IsEnum(ContributorRole)
  role: ContributorRole;
}
export class CreateOneNewUserContributorsDto {
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

  @IsNotEmpty()
  @IsString()
  @IsEnum(ContributorRole)
  role: ContributorRole;
}
