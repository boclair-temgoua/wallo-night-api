import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateSubSubSubProjectsDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  subSubProjectId: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsString()
  description: string;
}
export class UpdateSubSubSubProjectsDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsString()
  description: string;
}
