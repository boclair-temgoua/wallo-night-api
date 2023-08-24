import { Upload } from '../../models/Upload';

export type GetUploadsSelections = {
  search?: string;
  productId?: Upload['productId'];
};

export type GetOneUploadSelections = {
  uploadableId: Upload['id'];
};

export type UpdateUploadSelections = {
  uploadId: Upload['id'];
};

export type CreateUploadOptions = Partial<Upload>;

export type UpdateUploadOptions = Partial<Upload>;
