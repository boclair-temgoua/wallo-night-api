import { Gallery } from '../../models/Gallery';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetGalleriesSelections = {
  search?: string;
  pagination?: PaginationType;
  userId?: Gallery['userId'];
};

export type GetOneGalleriesSelections = {
  galleryId: Gallery['id'];
};

export type UpdateGalleriesSelections = {
  galleryId: Gallery['id'];
};

export type CreateGalleriesOptions = Partial<Gallery>;

export type UpdateGalleriesOptions = Partial<Gallery>;
