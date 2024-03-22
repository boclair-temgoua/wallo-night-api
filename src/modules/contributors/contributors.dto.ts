import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Match } from '../../app/utils/decorators/match.decorator';
import {
  ContributorRole,
  ContributorStatus,
  contributorRoleArrays,
  contributorStatusArrays,
} from './contributors.type';

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
  lastName: string;

  @IsOptional()
  @IsString()
  action: string;

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

export class UpdateRoleContributorsDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(contributorRoleArrays)
  role: ContributorRole;
}

export class ConfirmInvitationContributorsDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  contributorId: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(contributorStatusArrays)
  contributorStatus: ContributorStatus;

  @IsOptional()
  @MaxLength(100)
  @MinLength(8)
  @IsString()
  password: string;

  @IsOptional()
  @MaxLength(100)
  @MinLength(8)
  @Match('password')
  passwordConfirm: string;
}
