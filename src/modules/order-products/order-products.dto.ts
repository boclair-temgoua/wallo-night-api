import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsUUID,
  IsOptional,
  IsInt,
} from 'class-validator';

export type StatusOderProduct = 'ORDERED' | 'DELIVERING'