import { Wallet } from '../../models/Wallet';

export type AmountModel = {
  value: number;
  currency: string;
  month?: number;
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
