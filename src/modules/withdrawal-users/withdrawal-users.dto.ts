import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEnum,
  MinLength,
  IsPositive,
  Min,
  IsInt,
  IsOptional,
} from 'class-validator';
import { TransactionType } from '../transactions/transactions.type';

export class CreateWithdrawalUsersDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(TransactionType)
  type: TransactionType;
  
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  iban: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  phone: string;ß

  @IsOptional()
  @IsString()
  description: string;
}
