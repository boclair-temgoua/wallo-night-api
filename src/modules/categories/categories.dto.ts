import { User } from '../../models/User';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateOrUpdateCategoriesUsDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
