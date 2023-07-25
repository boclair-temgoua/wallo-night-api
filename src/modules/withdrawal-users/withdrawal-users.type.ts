import { WithdrawalUser } from '../../models/WithdrawalUser';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetWithdrawalUsersSelections = {
  search?: string;
  pagination?: PaginationType;
  userId?: WithdrawalUser['userId'];
  organizationId?: WithdrawalUser['organizationId'];
};

export type GetOneWithdrawalUserSelections = {
  withdrawalUserId?: WithdrawalUser['id'];
  userId?: WithdrawalUser['userId'];
};

export type UpdateWithdrawalUserSelections = {
  withdrawalUserId: WithdrawalUser['id'];
};

export type CreateWithdrawalUserOptions = Partial<WithdrawalUser>;

export type UpdateWithdrawalUserOptions = Partial<WithdrawalUser>;
