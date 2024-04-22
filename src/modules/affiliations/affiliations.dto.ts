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
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @MaxLength(100)
    @MinLength(5)
    email: string;

    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    @Min(1)
    @Max(100)
    percent: number;

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    productId: string;

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

    @IsOptional()
    @IsString()
    @IsUUID()
    productId: string;
}

export class GetOneAffiliationDto {
    @IsOptional()
    @IsString()
    affiliate: string;

    @IsOptional()
    @IsString()
    @IsUUID()
    affiliationId: string;
}
