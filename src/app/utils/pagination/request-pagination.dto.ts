import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsString,
  IsPositive,
  IsIn,
  IsOptional,
} from 'class-validator';

export type SortType = 'ASC' | 'DESC';
export class RequestPaginationDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsPositive()
  take: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsPositive()
  page: number;

  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  @Type(() => String)
  sort: SortType;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsPositive()
  count: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsPositive()
  current_page: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsPositive()
  next_page: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsPositive()
  prev_page: number;
}
