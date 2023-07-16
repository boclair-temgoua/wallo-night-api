import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsUUID,
  IsOptional,
  MinLength,
  IsInt,
  IsPositive,
  Min,
  MinDate,
  IsDateString,
} from 'class-validator';

export class FilterInvestmentsDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  donationId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  organizationId: string;
}

export class CreateOrUpdateInvestmentsDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  amount?: number;

  @IsOptional()
  @IsString()
  @IsUUID()
  donationId: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  currencyId: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
