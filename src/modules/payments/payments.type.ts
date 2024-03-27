import { PaginationType } from '../../app/utils/pagination';
import { Payment } from '../../models';

export type GetPaymentsSelections = {
  type?: string;
  search?: string;
  pagination?: PaginationType;
  userId?: Payment['userId'];
  organizationId?: Payment['organizationId'];
};

export type GetOnePaymentsSelections = {
  iban?: Payment['iban'];
  phone?: Payment['phone'];
  paymentId?: Payment['id'];
  status?: Payment['status'];
  cardCvc?: Payment['cardCvc'];
  cardNumber?: Payment['cardNumber'];
  cardExpYear?: Payment['cardExpYear'];
  cardExpMonth?: Payment['cardExpMonth'];
  organizationId?: Payment['organizationId'];
};

export type UpdatePaymentsSelections = {
  paymentId?: Payment['id'];
};

export type CreatePaymentsOptions = Partial<Payment>;

export type UpdatePaymentsOptions = Partial<Payment>;
