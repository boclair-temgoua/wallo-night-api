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
  IsEnum,
} from 'class-validator';
import { CurrencyCode } from '../currencies/currencies.type';

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
  pricePerMonthly?: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  pricePerYearly?: number;

  @IsNotEmpty()
  @IsString()
  @IsEnum(CurrencyCode)
  currency: CurrencyCode;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  messageWelcome: string;
}
