import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export type SortType = 'ASC' | 'DESC';

export type ProductStatus = 'ACTIVE' | 'PENDING';

export class PaginationDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsPositive()
  take: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  @Type(() => String)
  sort: SortType;

  @IsOptional()
  @IsString()
  @IsIn(['true', 'false'])
  @Type(() => String)
  isPaginate: string;
}
