import { IsString, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';

export type UploadType = 'IMAGE' | 'FILE';

export class UploadsDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  productId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  postId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  commissionId: string;

  @IsOptional()
  @IsString()
  uploadType: string;
}
