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

export class UpdateDonationsDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  title: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  price: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  messageWelcome: string;
}
