import { Payment } from '../../models';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export type GetPaymentsSelections = {
  search?: string;
  pagination?: PaginationType;
  userId?: Payment['userId'];
  organizationId?: Payment['organizationId'];
};

export type GetOnePaymentsSelections = {
  paymentId?: Payment['id'];
  cardNumber?: Payment['cardNumber'];
  organizationId?: Payment['organizationId'];
};

export type UpdatePaymentsSelections = {
  paymentId?: Payment['id'];
};

export type CreatePaymentsOptions = Partial<Payment>;

export type UpdatePaymentsOptions = Partial<Payment>;
