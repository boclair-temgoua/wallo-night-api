import { Withdrawal } from '../../models/Withdrawal';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetWithdrawalsSelections = {
  search?: string;
  pagination?: PaginationType;
  userId?: Withdrawal['userId'];
};

export type GetOneWithdrawalSelections = {
  withdrawalId: Withdrawal['id'];
};

export type UpdateWithdrawalSelections = {
  withdrawalId: Withdrawal['id'];
};

export type CreateWithdrawalOptions = Partial<Withdrawal>;

export type UpdateWithdrawalOptions = Partial<Withdrawal>;
