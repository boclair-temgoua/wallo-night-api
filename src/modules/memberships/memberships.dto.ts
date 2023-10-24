import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  Min,
  Max,
  IsOptional,
  IsInt,
  IsPositive,
  MinLength,
  IsUUID,
  MinDate,
  IsIn,
} from 'class-validator';

export class CreateOrUpdateMembershipsDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  title: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  price?: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  month?: number;

  // @IsNotEmpty()
  // @IsString()
  // @IsIn(currencyCodeArrays)
  // currency: CurrencyCode;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  messageWelcome: string;
}

export class GetOneMembershipDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  membershipId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  organizationId: string;
}

export class GetMembershipDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  organizationId: string;
}
