import { Injectable, Logger } from '@nestjs/common';
import { CurrencyData } from 'src/common/types/currency-data.type';
import { TatumSDK, Network, Ethereum } from '@tatumio/tatum';
import { CoinsProvider } from './coins.provider';
import { CoinFiat } from 'src/common/types/coin-fiat.type';
import { Currency } from 'src/common/types/currency.type';
import { ShortCoinsNames } from 'src/common/types/short-coins-manes.type';

interface RatesDTO {
  value: string;
  batchId: string;
}

interface ResponseData {
  data: RatesDTO[];
}

@Injectable()
export class TatumProvider extends CoinsProvider {
  private readonly logger = new Logger(TatumProvider.name);
  private readonly requestRates = [
    {
      currency: 'BTC',
      basePair: 'USD',
      batchId: 'BTC_USD',
    },
    {
      currency: 'BTC',
      basePair: 'EUR',
      batchId: 'BTC_EUR',
    },
    {
      currency: 'BTC',
      basePair: 'RUB',
      batchId: 'BTC_RUB',
    },
    {
      currency: 'BTC',
      basePair: 'KZT',
      batchId: 'BTC_KZT',
    },
    {
      currency: 'BTC',
      basePair: 'UAH',
      batchId: 'BTC_UAH',
    },
    {
      currency: 'BTC',
      basePair: 'NGN',
      batchId: 'BTC_NGN',
    },
    {
      currency: 'BTC',
      basePair: 'CNY',
      batchId: 'BTC_CNY',
    },
    {
      currency: 'BTC',
      basePair: 'BRL',
      batchId: 'BTC_BRL',
    },
    {
      currency: 'LTC',
      basePair: 'USD',
      batchId: 'LTC_USD',
    },
    {
      currency: 'LTC',
      basePair: 'EUR',
      batchId: 'LTC_EUR',
    },
    {
      currency: 'LTC',
      basePair: 'RUB',
      batchId: 'LTC_RUB',
    },
    {
      currency: 'LTC',
      basePair: 'KZT',
      batchId: 'LTC_KZT',
    },
    {
      currency: 'LTC',
      basePair: 'UAH',
      batchId: 'LTC_UAH',
    },
    {
      currency: 'LTC',
      basePair: 'NGN',
      batchId: 'LTC_NGN',
    },
    {
      currency: 'LTC',
      basePair: 'CNY',
      batchId: 'LTC_CNY',
    },
    {
      currency: 'LTC',
      basePair: 'BRL',
      batchId: 'LTC_BRL',
    },
    {
      currency: 'USDT',
      basePair: 'USD',
      batchId: 'USDT_USD',
    },
    {
      currency: 'USDT',
      basePair: 'EUR',
      batchId: 'USDT_EUR',
    },
    {
      currency: 'USDT',
      basePair: 'RUB',
      batchId: 'USDT_RUB',
    },
    {
      currency: 'USDT',
      basePair: 'KZT',
      batchId: 'USDT_KZT',
    },
    {
      currency: 'USDT',
      basePair: 'UAH',
      batchId: 'USDT_UAH',
    },
    {
      currency: 'USDT',
      basePair: 'NGN',
      batchId: 'USDT_NGN',
    },
    {
      currency: 'USDT',
      basePair: 'CNY',
      batchId: 'USDT_CNY',
    },
    {
      currency: 'USDT',
      basePair: 'BRL',
      batchId: 'USDT_BRL',
    },
    {
      currency: 'ETH',
      basePair: 'USD',
      batchId: 'ETH_USD',
    },
    {
      currency: 'ETH',
      basePair: 'EUR',
      batchId: 'ETH_EUR',
    },
    {
      currency: 'ETH',
      basePair: 'RUB',
      batchId: 'ETH_RUB',
    },
    {
      currency: 'ETH',
      basePair: 'KZT',
      batchId: 'ETH_KZT',
    },
    {
      currency: 'ETH',
      basePair: 'UAH',
      batchId: 'ETH_UAH',
    },
    {
      currency: 'ETH',
      basePair: 'NGN',
      batchId: 'ETH_NGN',
    },
    {
      currency: 'ETH',
      basePair: 'CNY',
      batchId: 'ETH_CNY',
    },
    {
      currency: 'ETH',
      basePair: 'BRL',
      batchId: 'ETH_BRL',
    },
    {
      currency: 'SOL',
      basePair: 'USD',
      batchId: 'SOL_USD',
    },
    {
      currency: 'SOL',
      basePair: 'EUR',
      batchId: 'SOL_EUR',
    },
    {
      currency: 'SOL',
      basePair: 'RUB',
      batchId: 'SOL_RUB',
    },
    {
      currency: 'SOL',
      basePair: 'KZT',
      batchId: 'SOL_KZT',
    },
    {
      currency: 'SOL',
      basePair: 'UAH',
      batchId: 'SOL_UAH',
    },
    {
      currency: 'SOL',
      basePair: 'NGN',
      batchId: 'SOL_NGN',
    },
    {
      currency: 'SOL',
      basePair: 'CNY',
      batchId: 'SOL_CNY',
    },
    {
      currency: 'SOL',
      basePair: 'BRL',
      batchId: 'SOL_BRL',
    },
    {
      currency: 'TRON',
      basePair: 'USD',
      batchId: 'TRON_USD',
    },
    {
      currency: 'TRON',
      basePair: 'EUR',
      batchId: 'TRON_EUR',
    },
    {
      currency: 'TRON',
      basePair: 'RUB',
      batchId: 'TRON_RUB',
    },
    {
      currency: 'TRON',
      basePair: 'KZT',
      batchId: 'TRON_KZT',
    },
    {
      currency: 'TRON',
      basePair: 'UAH',
      batchId: 'TRON_UAH',
    },
    {
      currency: 'TRON',
      basePair: 'NGN',
      batchId: 'TRON_NGN',
    },
    {
      currency: 'TRON',
      basePair: 'CNY',
      batchId: 'TRON_CNY',
    },
    {
      currency: 'TRON',
      basePair: 'BRL',
      batchId: 'TRON_BRL',
    },
  ];

  public async get(): Promise<Partial<CurrencyData> | null> {
    const rates = await this.queryRates();
    if (!rates) return rates;
    const convertedRate = this.convertResponse(rates.data);
    return this.countAllRates(convertedRate);
  }

  private async queryRates() {
    try {
      const tatum = await this.initTatum();
      const rates = await tatum.rates.getCurrentRateBatch(this.requestRates);
      await tatum.destroy();
      return rates as ResponseData;
    } catch (error) {
      this.logger.error('Tatum Error:', error);
      return null;
    }
  }

  private async initTatum() {
    return await TatumSDK.init<Ethereum>({
      network: Network.ETHEREUM,
      apiKey: { v4: process.env.TATUM_API },
    });
  }

  private convertResponse(response: RatesDTO[]) {
    const convertedRates: Partial<CoinFiat> = {};
    response.forEach((rate) => {
      const [from, to] = rate.batchId
        .split('_')
        .map((e) => (e === 'TRON' ? 'trx' : e.toLowerCase()));
      const fromKey = from as ShortCoinsNames;
      const toKey = to as Currency;
      if (!convertedRates[fromKey]) {
        convertedRates[fromKey] = {};
      }
      convertedRates[fromKey][toKey] = +rate.value;
    });
    return convertedRates;
  }
}
