import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsIn,
} from 'class-validator';
import { ContributorRole, contributorRoleArrays } from './contributors.type';
import { MaxLength, IsEmail } from 'class-validator';

export class CreateOneContributorOrganizationDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userId: string;
}

export class UpdateRoleContributorDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  contributorId: string;

  @IsOptional()
  @IsString()
  @IsIn(contributorRoleArrays)
  role: ContributorRole;
}

export class CreateOneNewUserContributorsDto {
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

  @IsNotEmpty()
  @IsString()
  @IsIn(contributorRoleArrays)
  role: ContributorRole;
}
