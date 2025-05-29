import { Injectable, Logger } from '@nestjs/common';
import { CoinsProvider } from './coins.provider';
import { CoinFiat } from 'src/common/types/coin-fiat.type';
import axios from 'axios';
import { ShortFiatsNames } from 'src/common/types/short-fiats-names.type';

type AvailableFiats = 'USD' | 'EUR' | 'RUB' | 'KZT' | 'UAH' | 'NGN' | 'CNY';
const availableFiats: AvailableFiats[] = [
  'USD',
  'EUR',
  'RUB',
  'KZT',
  'UAH',
  'NGN',
  'CNY',
];
type AvailableCoins = 'BTC' | 'LTC' | 'USDT' | 'ETH' | 'SOL';
const availableCoins: AvailableCoins[] = ['BTC', 'LTC', 'USDT', 'ETH', 'SOL'];

interface Response {
  data: {
    currency: AvailableCoins;
    rates: Record<AvailableCoins | AvailableFiats, string>;
  };
}

@Injectable()
export class CoinbaseProvider extends CoinsProvider {
  logger = new Logger(CoinbaseProvider.name);

  public async get() {
    const rates: Partial<CoinFiat> = await this.queryAndConvert();
    const countedRates = this.countAllRates(rates);
    return countedRates;
  }

  private async queryAndConvert() {
    let convertedRates: Partial<CoinFiat> = {};
    for (let i = 0; i < availableCoins.length; i++) {
      const coin = availableCoins[i];
      const response = await this.queryRates(coin);
      if (!response) continue;
      const convertedRate = this.convertRates(response.data.rates);
      convertedRates = {
        ...convertedRates,
        [coin.toLowerCase()]: convertedRate,
      };
    }
    return convertedRates;
  }

  private async queryRates(coin: AvailableCoins) {
    try {
      const response = await axios.get<Response>(
        `https://api.coinbase.com/v2/exchange-rates?currency=${coin}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Error Coinbase ${coin}: `, error);
      return null;
    }
  }

  private convertRates(
    rates: Response['data']['rates'],
  ): Partial<Record<ShortFiatsNames, number>> {
    const convertedRates: Partial<Record<ShortFiatsNames, number>> = {};
    availableFiats.forEach((fiat) => {
      const cost = rates[fiat];
      const shortFiatName = fiat.toLowerCase() as ShortFiatsNames;
      convertedRates[shortFiatName] = +cost;
    });
    return convertedRates;
  }
}
