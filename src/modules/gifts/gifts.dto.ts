import { Transform, Type } from 'class-transformer';
import { MatchDate } from '../../app/utils/decorators/date.decorator';
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
} from 'class-validator';

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
