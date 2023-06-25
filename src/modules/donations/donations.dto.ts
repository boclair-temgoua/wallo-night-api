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

export class FilterDonationsDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  organizationId: string;
}

export class CreateOrUpdateDonationsDto {
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
  @IsUUID()
  currencyId: string;

  @IsNotEmpty()
  @Transform(({ value }) => value && new Date(value))
  @MinDate(new Date())
  @Type(() => Date)
  expiredAt: Date;

  @IsNotEmpty()
  @IsString()
  description: string;
}
