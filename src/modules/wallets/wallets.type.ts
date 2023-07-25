import { Wallet } from '../../models/Wallet';

export type GetWalletsSelections = {
  search?: string;
};

export type GetOneWalletSelections = {
  userId?: Wallet['userId'];
  walletId?: Wallet['id'];
};

export type UpdateWalletSelections = {
  walletId?: Wallet['id'];
  userId?: Wallet['userId'];
};

export type CreateWalletOptions = Partial<Wallet>;

export type UpdateWalletOptions = Partial<Wallet>;
