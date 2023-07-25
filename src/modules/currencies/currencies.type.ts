import { Currency } from '../../models';

export enum CurrencyCode {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  XAF = 'XAF',
  XOF = 'XOF',
}

export type GetCurrenciesSelections = {
  search?: string;
};

export type GetOneCurrenciesSelections = {
  currencyId?: Currency['id'];
  code?: Currency['code'];
};
