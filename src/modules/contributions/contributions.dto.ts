import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Min,
  IsPositive,
  IsInt,
} from 'class-validator';

export class SearchContributionDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  donationId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  giftId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  userId: string;
}

export class CreateOneContributionDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  donationId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  userSendId: string;
  
  @IsOptional()
  @IsString()
  @IsUUID()
  giftId: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  amount: number;
}
