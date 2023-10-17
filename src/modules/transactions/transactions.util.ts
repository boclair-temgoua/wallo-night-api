import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CurrenciesService } from '../currencies/currencies.service';
import { AmountModel } from '../wallets/wallets.type';

@Injectable()
export class TransactionsUtil {
  constructor(private readonly currenciesService: CurrenciesService) {}

  async convertedValue(options: AmountModel): Promise<AmountModel> {
    const { currency, value } = options;

    const findOnCurrency = await this.currenciesService.findOneBy({
      code: currency,
    });
    const newValue = Number(value) / Number(findOnCurrency?.amount);

    if (!newValue) {
      throw new HttpException(
        `Value ${newValue} not convert please try again`,
        HttpStatus.NOT_FOUND,
      );
    }

    return { currency, value: Number(newValue.toFixed(2)) };
  }
}
