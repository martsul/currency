import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { CurrencyData } from 'src/common/types/currency-data.type';
import { ShortCoinsNames } from 'src/common/types/short-coins-manes.type';
import { ShortFiatsNames } from 'src/common/types/short-fiats-names.type';
import { CoinsProvider } from './coins.provider';
import { CoinFiat } from 'src/common/types/coin-fiat.type';

type ResponseData = {
  data: Record<
    Uppercase<ShortCoinsNames>,
    {
      quote: Record<Uppercase<ShortFiatsNames>, { price: number }>;
    }
  >;
};

const FIATS = ['USD', 'EUR', 'RUB', 'KZT', 'UAH', 'NGN', 'CNY', 'BRL'] as const;

@Injectable()
export class CoinmarketcapProvider extends CoinsProvider {
  private readonly logger = new Logger(CoinmarketcapProvider.name);

  async get() {
    const rates = await this.#getRates();
    return rates ? this.countAllRates(rates) : rates;
  }

  async #getRates() {
    try {
      const convertedData: Partial<CoinFiat> = {};
      await Promise.allSettled(
        FIATS.map((fiat) =>
          this.#queryRates(fiat).then((response) =>
            this.#convertResponseData(response.data, convertedData),
          ),
        ),
      );
      return convertedData;
    } catch (error) {
      this.logger.error('Request Coinmarketcap Error:', error);
      return null;
    }
  }

  #queryRates(convert: string) {
    return axios.get<ResponseData>(
      'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
      {
        params: {
          symbol: 'BTC,ETH,LTC,XMR,USDT,SOL,TRX',
          convert,
        },
        headers: {
          'X-CMC_PRO_API_KEY': process.env.COINMARKECAP_API,
        },
      },
    );
  }

  #convertResponseData(
    data: ResponseData,
    convertedData: Partial<CurrencyData>,
  ) {
    (Object.keys(data.data) as Uppercase<ShortCoinsNames>[]).forEach(
      (coinKey) => {
        const quoteData = data.data[coinKey].quote;
        (Object.keys(quoteData) as Uppercase<ShortFiatsNames>[]).forEach(
          (fiatKey) => {
            const coin = coinKey.toLowerCase() as ShortCoinsNames;
            const fiat = fiatKey.toLowerCase() as ShortFiatsNames;
            if (!convertedData[coin]) {
              convertedData[coin] = {};
            }
            convertedData[coin][fiat] = quoteData[fiatKey].price;
          },
        );
      },
    );
  }
}
