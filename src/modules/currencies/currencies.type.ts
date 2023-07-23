import { Currency } from '../../models';

export type GetCurrenciesSelections = {
  search?: string;
};

export type GetOneCurrenciesSelections = {
  currencyId?: Currency['id'];
  code?: Currency['code'];
};
