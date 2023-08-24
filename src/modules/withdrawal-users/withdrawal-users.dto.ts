import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsPositive,
  Min,
  IsInt,
  IsOptional,
  IsIn,
} from 'class-validator';
import { TransactionType, transactionTypeArrays } from '../transactions/transactions.type';

export class CreateWithdrawalUsersDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(transactionTypeArrays)
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
