import { Album } from '../../models/Album';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetAlbumsSelections = {
  search?: string;
  pagination?: PaginationType;
  userId?: Album['userId'];
  organizationId?: Album['organizationId'];
};

export type GetOneAlbumsSelections = {
  albumId: Album['id'];
};

export type UpdateAlbumsSelections = {
  albumId: Album['id'];
};

export type CreateAlbumsOptions = Partial<Album>;

export type UpdateAlbumsOptions = Partial<Album>;