import { MatchDate } from './../../app/utils/decorators/date.decorator';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  Min,
  Max,
  IsOptional,
  IsInt,
  IsPositive,
  IsBoolean,
} from 'class-validator';

export class CreateOrUpdateDiscountsDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  code: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  description: string;

  @IsOptional()
  @IsBoolean()
  enableExpiredAt: boolean;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(100)
  percent: number;

  @IsOptional()
  startedAt: Date;

  @IsOptional()
  expiredAt: Date;
}
