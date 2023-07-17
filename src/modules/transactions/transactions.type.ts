import { Transaction } from '../../models/Transaction';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetTransactionsSelections = {
  search?: string;
  pagination?: PaginationType;
  userId?: Transaction['userId'];
  donationId?: Transaction['donationId'];
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
