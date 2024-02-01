import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export type StatusCommission = 'ACTIVE' | 'PENDING';
export class CreateOrUpdateCommissionsDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  price: string;

  @IsOptional()
  @IsString()
  limitSlot: string;

  @IsOptional()
  @IsString()
  enableLimitSlot: string;

  @IsOptional()
  @IsString()
  urlMedia: string;

  @IsOptional()
  @IsString()
  messageAfterPayment: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class GetOneCommissionDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  commissionId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  organizationId: string;

  @IsOptional()
  @IsString()
  commissionSlug: string;
}

export class GetCommissionsDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  organizationId: string;

  @IsOptional()
  @IsString()
  status: string;
}
