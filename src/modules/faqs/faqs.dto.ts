import { User } from '../../models/User';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsBoolean,
  IsOptional,
  IsIn,
  IsUUID,
} from 'class-validator';

export type TypeFaq = 'PRICING' | 'HELP';

export const typeFaqArrays = ['PRICING', 'HELP'];

export class CreateOrUpdateFaqsDto {
  //@IsNotEmpty()
  //@IsString()
  //@IsIn(typeFaqArrays)
  //type: TypeFaq;

  @IsOptional()
  @IsBoolean()
  status: boolean;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  user: User;
}

export class FaqUuidDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  faqId: string;
}

export class FaqTypeDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(typeFaqArrays)
  type: TypeFaq;
}
