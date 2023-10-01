import { Category } from '../../models/Category';
import { Event } from '../../models/Event';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetEventsSelections = {
  search?: string;
  pagination?: PaginationType;
  status?: string;
  userId?: Event['userId'];
};

export type GetOneEventsSelections = {
  eventId?: Event['id'];
  userId?: Event['userId'];
  eventSlug?: Event['slug'];
};

export type UpdateEventsSelections = {
  eventId: Event['id'];
};

export type CreateEventsOptions = Partial<Event>;

export type UpdateEventsOptions = Partial<Event>;
