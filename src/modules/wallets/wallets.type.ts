import { Wallet } from '../../models/Wallet';

export type GetWalletsSelections = {
  search?: string;
};

export type GetOneWalletSelections = {
  organizationId?: Wallet['organizationId'];
  walletId?: Wallet['id'];
};

export type UpdateWalletSelections = {
  walletId?: Wallet['id'];
  organizationId?: Wallet['organizationId'];
};

export type CreateWalletOptions = Partial<Wallet>;

export type UpdateWalletOptions = Partial<Wallet>;
