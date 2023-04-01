import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateOrUpdateProjectsDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsString()
  description: string;
}
