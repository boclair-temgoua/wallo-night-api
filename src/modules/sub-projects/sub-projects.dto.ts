import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateOrUpdateSubProjectsDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  projectId: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsString()
  description: string;
}
