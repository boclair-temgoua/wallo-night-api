import { PaginationType } from '../../app/utils/pagination';
import { Conversation } from '../../models';

export type GetConversationsSelections = {
  search?: string;
  organizationToId?: Conversation['organizationToId'];
  organizationFromId?: Conversation['organizationFromId'];
  pagination?: PaginationType;
};

export type GetOneConversationSelections = {
  fkConversationId?: Conversation['fkConversationId'];
  organizationToId?: Conversation['organizationToId'];
  organizationFromId?: Conversation['organizationFromId'];
  conversationId?: Conversation['id'];
};

export type UpdateConversationSelections = {
  conversationId?: Conversation['id'];
};

export type CreateConversationOptions = Partial<Conversation>;

export type UpdateConversationOptions = Partial<Conversation>;
