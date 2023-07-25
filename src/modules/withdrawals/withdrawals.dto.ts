import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsUUID,
  MinLength,
  IsPositive,
  Min,
  IsInt,
  IsOptional,
} from 'class-validator';

export class CreateWithdrawalsDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  withdrawalUserId: string;

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
  amount?: number;

  @IsNotEmpty()
  @IsString()
  description: string;
}
