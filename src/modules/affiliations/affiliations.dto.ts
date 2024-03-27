import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateOrUpdateAffiliationsDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  title: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(100)
  @MinLength(5)
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  productId: string;

  @IsNotEmpty()
  @IsString()
  isOneProduct: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(100)
  percent: number;

  @IsOptional()
  expiredAt: Date;

  @IsOptional()
  @IsString()
  description: string;
}

export class GetAffiliationDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  organizationSellerId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  organizationReceivedId: string;
}

export class GetOneAffiliationDto {
  @IsOptional()
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  affiliationId: string;
}
