import { OurEvent } from '../../models';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetOurEventsSelections = {
  search?: string;
  pagination?: PaginationType;
  status?: string;
  userId?: OurEvent['userId'];
  organizationId?: OurEvent['organizationId'];
};

export type GetOneOurEventsSelections = {
  eventId?: OurEvent['id'];
  userId?: OurEvent['userId'];
  eventSlug?: OurEvent['slug'];
  organizationId?: OurEvent['organizationId'];
};

export type UpdateOurEventsSelections = {
  eventId: OurEvent['id'];
};

export type CreateOurEventsOptions = Partial<OurEvent>;

export type UpdateOurEventsOptions = Partial<OurEvent>;
