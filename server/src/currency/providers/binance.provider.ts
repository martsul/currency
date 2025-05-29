import { Logger } from '@nestjs/common';
import { CoinsProvider } from './coins.provider';
import axios from 'axios';
import { CoinFiat } from 'src/common/types/coin-fiat.type';
import { ALL_FIAT } from 'src/common/constants/all-fiat';
import { ALL_COINS } from 'src/common/constants/all-coins';

interface RatesDTO {
  symbol: string;
  price: string;
}
type Rates = RatesDTO[];

export class BinanceProvider extends CoinsProvider {
  private readonly logger = new Logger(CoinsProvider.name);

  public async get() {
    const crudRates = await this.queryRates();
    const convertedRates = this.convertRates(crudRates.data);
    const countedRates = this.countAllRates(convertedRates);
    return countedRates;
  }

  private async queryRates() {
    return await axios.get<Rates>(
      'https://api.binance.com/api/v3/ticker/price',
    );
  }

  private convertRates(rates: Rates): Partial<CoinFiat> {
    const fiats = Array.from(ALL_FIAT);
    const coins = Array.from(ALL_COINS);
    const convertedRates: Partial<CoinFiat> = {};
    coins.forEach((coin) => {
      fiats.forEach((fiat) => {
        const id = coin.toUpperCase() + fiat.toUpperCase();
        const rate = rates.find((r) => r.symbol === id);
        if (rate && +rate.price) {
          if (!convertedRates[coin]) {
            convertedRates[coin] = {};
          }
          convertedRates[coin][fiat] = +rate.price;
        }
      });
    });
    return convertedRates;
  }
}
