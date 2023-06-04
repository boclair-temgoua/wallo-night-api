import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsUUID,
  IsOptional,
  IsInt,
} from 'class-validator';

export enum StatusOderProduct {
  ORDERED = 'ORDERED',
  DELIVERING = 'DELIVERING',
}
