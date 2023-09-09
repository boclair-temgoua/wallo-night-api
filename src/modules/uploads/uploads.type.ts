import { Upload } from '../../models/Upload';

export type GetUploadsSelections = {
  search?: string;
  uploadType?: string;
  postId?: Upload['postId'];
  productId?: Upload['productId'];
  commissionId?: Upload['commissionId'];
};

export type UpdateUploadSelections = {
  uploadId: Upload['id'];
};

export type CreateUploadOptions = Partial<Upload>;

export type UpdateUploadOptions = Partial<Upload>;
