import { Wallet } from '../../models/Wallet';

export type AmountModel = {
  value: number;
  currency: string;
  description?: string;
  month?: number;
};

export type CardModel = {
  cardNumber: string;
  cardExpMonth: number;
  cardExpYear: number;
  cardCvc: string;
  email: string;
  isSaveCard: boolean;
  fullName: string;
};

export type GetWalletsSelections = {
  search?: string;
};

export type GetOneWalletSelections = {
  walletId?: Wallet['id'];
  organizationId?: Wallet['organizationId'];
};

export type UpdateWalletSelections = {
  walletId?: Wallet['id'];
  organizationId?: Wallet['organizationId'];
};

export type CreateWalletOptions = Partial<Wallet>;

export type UpdateWalletOptions = Partial<Wallet>;
