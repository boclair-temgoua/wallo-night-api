import { Upload } from '../../models/Upload';

export type GetUploadsSelections = {
  search?: string;
  uploadType?: string;
  model?: string;
  userId?: Upload['userId'];
  uploadableId?: Upload['uploadableId'];
};

export type UpdateUploadSelections = {
  uploadId: Upload['id'];
};

export type CreateUploadOptions = Partial<Upload>;

export type UpdateUploadOptions = Partial<Upload>;
