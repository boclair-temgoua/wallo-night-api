import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsUUID,
  IsOptional,
  IsInt,
} from 'class-validator';

export class FilterTransactionsDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  userId: string;
}
