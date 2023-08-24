import { Transaction } from '../../models/Transaction';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type TransactionType = 'PAYPAL' | 'CARD' | 'COUPON' | 'PHONE';

export const transactionTypeArrays = ['PAYPAL', 'CARD', 'COUPON', 'PHONE'];

export type GetTransactionsSelections = {
  search?: string;
  pagination?: PaginationType;
  userId?: Transaction['userId'];
  campaignId?: Transaction['campaignId'];
  userSendId?: Transaction['userSendId'];
  userReceiveId?: Transaction['userReceiveId'];
};

export type GetOneTransactionSelections = {
  transactionId: Transaction['id'];
};

export type UpdateTransactionSelections = {
  transactionId: Transaction['id'];
};

export type CreateTransactionOptions = Partial<Transaction>;

export type UpdateTransactionOptions = Partial<Transaction>;
