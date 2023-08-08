import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { ContributorRole } from './contributors.type';
import { MaxLength, IsEmail } from 'class-validator';
import { FilterQueryType } from '../../app/utils/search-query';

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
  @IsEnum(ContributorRole)
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
  @IsEnum(ContributorRole)
  role: ContributorRole;
}
