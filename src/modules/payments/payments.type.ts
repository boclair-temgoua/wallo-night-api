import { PaginationType } from '../../app/utils/pagination/with-pagination';
import { Payment } from '../../models';

export type GetPaymentsSelections = {
  type?: string;
  search?: string;
  pagination?: PaginationType;
  userId?: Payment['userId'];
  organizationId?: Payment['organizationId'];
};

export type GetOnePaymentsSelections = {
  paymentId?: Payment['id'];
  phone?: Payment['phone'];
  status?: Payment['status'];
  cardNumber?: Payment['cardNumber'];
  cardCvc?: Payment['cardCvc'];
  cardExpYear?: Payment['cardExpYear'];
  cardExpMonth?: Payment['cardExpMonth'];
  organizationId?: Payment['organizationId'];
};

export type UpdatePaymentsSelections = {
  paymentId?: Payment['id'];
};

export type CreatePaymentsOptions = Partial<Payment>;

export type UpdatePaymentsOptions = Partial<Payment>;
