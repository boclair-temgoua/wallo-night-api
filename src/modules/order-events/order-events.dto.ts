import { StatusType } from '../../app/utils/pagination';
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

export class CreateOrUpdateOderEventsDto {
  @IsOptional()
  @IsString()
  status: StatusType;
}
