import { IsString, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';

export type UploadType = 'IMAGE' | 'FILE';

export class UploadsDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  uploadableId: string;

  @IsNotEmpty()
  @IsString()
  model: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  organizationId: string;

  @IsOptional()
  @IsString()
  uploadType: string;
}
