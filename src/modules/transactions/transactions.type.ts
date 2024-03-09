import { PaginationType } from '../../app/utils/pagination/with-pagination';
import { Transaction } from '../../models/Transaction';

export type TransactionType = 'PAYPAL' | 'CARD' | 'COUPON' | 'PHONE';

export const transactionTypeArrays = ['PAYPAL', 'CARD', 'COUPON', 'PHONE'];

export type GetTransactionsSelections = {
  search?: string;
  model?: string;
  days?: number;
  pagination?: PaginationType;
  userBuyerId?: Transaction['userBuyerId'];
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
