import { Wallet } from '../../models/Wallet';


export type GetWalletsSelections = {
  search?: string;
};

export type GetOneWalletSelections = {
  walletId: Wallet['id'];
};

export type UpdateWalletSelections = {
  walletId: Wallet['id'];
};

export type CreateWalletOptions = Partial<Wallet>;

export type UpdateWalletOptions = Partial<Wallet>;