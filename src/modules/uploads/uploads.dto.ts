import {
  IsString,
  IsOptional,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';

export class UploadsDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  productId: string;
}
