import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

type ResponseData = {
  'Realtime Currency Exchange Rate': {
    '1. From_Currency Code': string;
    '2. From_Currency Name': string;
    '3. To_Currency Code': string;
    '4. To_Currency Name': string;
    '5. Exchange Rate': string;
    '6. Last Refreshed': string;
    '7. Time Zone': string;
    '8. Bid Price': string;
    '9. Ask Price': string;
  };
};

const REQUESTS = [
  `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=USD&apikey=`,
  `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=LTC&to_currency=USD&apikey=`,
  `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USDT&to_currency=USD&apikey=`,
  `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=XMR&to_currency=USD&apikey=`,
  `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=ETH&to_currency=USD&apikey=`,
  `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=SOL&to_currency=USD&apikey=`,
  `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=TRX&to_currency=USD&apikey=`,
  `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=EUR&to_currency=USD&apikey=`,
  `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=RUB&to_currency=USD&apikey=`,
  `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=KZT&to_currency=USD&apikey=`,
  `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=UAH&to_currency=USD&apikey=`,
  `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=NGN&to_currency=USD&apikey=`,
  `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=CNY&to_currency=USD&apikey=`,
  `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BRL&to_currency=USD&apikey=`,
  `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=USD&apikey=`,
];

@Injectable()
export class AlphavantageProvider {
  private readonly logger = new Logger(AlphavantageProvider.name);

  async get() {
    return await this.#queryRates();
  }

  async #queryRates() {
    try {
      return await Promise.allSettled(
        REQUESTS.map((r, i) => {
          const api =
            i >= 10
              ? process.env.ALPHAVANTAGE_API_T
              : i >= 5
                ? process.env.ALPHAVANTAGE_API_S
                : process.env.ALPHAVANTAGE_API_F;
          return axios.get<ResponseData>(r + api).then((res) => res.data);
        }),
      );
    } catch (error) {
      this.logger.error(`Request Alphavantage Error`, error);
    }
  }
}
