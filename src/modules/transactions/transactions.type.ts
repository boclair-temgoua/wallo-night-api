import { Transaction } from '../../models/Transaction';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type TransactionType = 'PAYPAL' | 'CARD' | 'COUPON' | 'PHONE';

export const transactionTypeArrays = ['PAYPAL', 'CARD', 'COUPON', 'PHONE'];

export type GetTransactionsSelections = {
  search?: string;
  model?: string;
  pagination?: PaginationType;
  userId?: Transaction['userId'];
  userSendId?: Transaction['userSendId'];
  userReceiveId?: Transaction['userReceiveId'];
  organizationId?: Transaction['organizationId'];
};

export type GetOneTransactionSelections = {
  transactionId: Transaction['id'];
};

export type UpdateTransactionSelections = {
  transactionId: Transaction['id'];
};

export type CreateTransactionOptions = Partial<Transaction>;

export type UpdateTransactionOptions = Partial<Transaction>;
