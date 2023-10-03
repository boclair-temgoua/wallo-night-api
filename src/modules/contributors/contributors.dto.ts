import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsIn,
} from 'class-validator';
import { ContributorRole, contributorRoleArrays } from './contributors.type';
import { MaxLength, IsEmail } from 'class-validator';

export class GetContributorsDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  organizationId: string;
}

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
  @IsIn(contributorRoleArrays)
  role: ContributorRole;
}
