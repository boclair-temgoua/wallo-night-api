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
} from 'class-validator';

export class CreateOrUpdateDiscountsDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  description: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(100)
  percent?: number;

  @IsNotEmpty()
  startedAt: Date;

  @IsNotEmpty()
  @MatchDate('startedAt')
  expiredAt: Date;
}
