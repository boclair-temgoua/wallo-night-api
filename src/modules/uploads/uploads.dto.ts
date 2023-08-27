import { IsString, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';

export type UploadType = 'IMAGE' | 'FILE';

export class UploadsDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  productId: string;

  @IsNotEmpty()
  @IsString()
  uploadType: string;
}
