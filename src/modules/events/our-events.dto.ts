import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsIn,
} from 'class-validator';

export type StatusEvent = 'ACTIVE' | 'PENDING';

export type CurrencyEvent = 'EUR' | 'CAD';

export const EventTypeArrays = ['DIGITAL', 'PHYSICAL'];

export class CreateOrUpdateOurEventsDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['EUR'])
  currency: CurrencyEvent;

  @IsOptional()
  @IsString()
  requirement: string;

  @IsOptional()
  @IsString()
  urlMedia: string;

  @IsNotEmpty()
  dateEvent: Date;

  @IsOptional()
  @IsString()
  price: string;

  @IsOptional()
  @IsString()
  urlRedirect: string;

  @IsOptional()
  @IsString()
  enableUrlRedirect: string;

  @IsOptional()
  @IsString()
  messageAfterPayment: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class GetOneOurEventDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  eventId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  eventSlug: string;
}

export class GetOurEventsDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  organizationId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  typeIds: string;

  @IsOptional()
  @IsString()
  status: string;
}
