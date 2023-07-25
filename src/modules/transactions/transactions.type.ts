import { Transaction } from '../../models/Transaction';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export enum TransactionType {
  PAYPAL = 'PAYPAL',
  CARD = 'CARD',
  COUPON = 'COUPON',
}

export type GetTransactionsSelections = {
  search?: string;
  pagination?: PaginationType;
  userId?: Transaction['userId'];
  campaignId?: Transaction['campaignId'];
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
