import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  NotEquals,
  ValidateIf,
} from 'class-validator';
export class SearchQueryDto {
  @IsString()
  @IsOptional()
  @NotEquals(null)
  @NotEquals('')
  @ValidateIf((object, value) => value !== undefined)
  search?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  organizationId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  userId: string;
}
export class PasswordBodyDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(8)
  password: string;
}

export enum FilterQueryType {
  ORGANIZATION = 'ORGANIZATION',
  CAMPAIGN = 'CAMPAIGN',
  DONATION = 'DONATION',
  MEMBERSHIP = 'MEMBERSHIP',
  GIFT = 'GIFT',
  HELP = 'HELP',
}

export enum WhoCanSeeType {
  PUBLIC = 'PUBLIC',
  MEMBERSHIP = 'MEMBERSHIP',
  SUPPORTER = 'SUPPORTER',
}
