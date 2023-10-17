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
import {
  CurrencyCode,
  currenciesCodeArrays,
} from '../currencies/currencies.type';

export class CreateOrUpdateGiftsDto {
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
  amount?: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(currenciesCodeArrays)
  currency: CurrencyCode;

  @IsNotEmpty()
  @Transform(({ value }) => value && new Date(value))
  @MinDate(new Date())
  @Type(() => Date)
  expiredAt: Date;

  @IsNotEmpty()
  @IsString()
  description: string;
}
