import { Currency } from '../../models';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'XAF' | 'XOF';

export const currencyCodeArrays = ['USD', 'EUR', 'GBP', 'XAF', 'XOF'];

export type GetCurrenciesSelections = {
  search?: string;
};

export type GetOneCurrenciesSelections = {
  currencyId?: Currency['id'];
  code?: Currency['code'];
};
