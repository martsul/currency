import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { CurrencyData } from 'src/common/types/currency-data.type';
import { FullCoinsNames } from 'src/common/types/full-coins-names.type';
import { ShortCoinsNames } from 'src/common/types/short-coins-manes.type';
import { ShortFiatsNames } from 'src/common/types/short-fiats-names.type';
import { CoinsProvider } from './coins.provider';

const coinFormat: Record<FullCoinsNames, ShortCoinsNames> = {
  bitcoin: 'btc',
  ethereum: 'eth',
  litecoin: 'ltc',
  monero: 'xmr',
  solana: 'sol',
  tether: 'usdt',
  tron: 'tron',
};

type ResponseData = Record<
  FullCoinsNames,
  Record<ShortFiatsNames | ShortCoinsNames, number>
>;

@Injectable()
export class CoingeckoProvider extends CoinsProvider {
  private readonly logger = new Logger(CoingeckoProvider.name);

  async get(): Promise<Partial<CurrencyData> | null> {
    const coinFiatRates = await this.#queryRates();
    const allRates = coinFiatRates
      ? this.countAllRates(this.#convertAllRates(coinFiatRates))
      : null;
    return allRates;
  }

  async #queryRates() {
    try {
      const response = await axios.get<ResponseData>(
        'https://api.coingecko.com/api/v3/simple/price',
        {
          params: {
            ids: 'bitcoin,ethereum,litecoin,monero,solana,tether,tron',
            vs_currencies: 'usd,eur,rub,kzt,uah,ngn,cny,brl',
          },
        },
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Request Coingecko Error`, error);
      return null;
    }
  }

  #convertAllRates(allRates: ResponseData): Partial<CurrencyData> {
    const convertedRates: Partial<CurrencyData> = {};
    (Object.keys(coinFormat) as FullCoinsNames[]).forEach((coin) => {
      convertedRates[coinFormat[coin]] = allRates[coin];
    });
    return convertedRates;
  }
}
