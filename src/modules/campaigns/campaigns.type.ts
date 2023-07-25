import { Campaign } from '../../models';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetCampaignsSelections = {
  search?: string;
  pagination?: PaginationType;
  userId?: Campaign['userId'];
  organizationId?: Campaign['organizationId'];
};

export type GetOneCampaignSelections = {
  campaignId: Campaign['id'];
};

export type UpdateCampaignSelections = {
  campaignId: Campaign['id'];
};

export type CreateCampaignOptions = Partial<Campaign>;

export type UpdateCampaignOptions = Partial<Campaign>;
