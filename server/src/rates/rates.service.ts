import { Injectable, Logger } from '@nestjs/common';
import { CurrencyService } from 'src/currency/currency.service';

@Injectable()
export class RatesService {
  private readonly logger = new Logger(RatesService.name);

  constructor(
    private readonly currencyService: CurrencyService,
    // private readonly coinmarketcapProvider: CoinmarketcapProvider,
    // private readonly coingeckoProvider: CoingeckoProvider,
  ) {}

  getAll() {
    return this.currencyService.getAll();
  }

  getOne() {
    return this.currencyService.getOne();
  }

  // private async fetchRates() {
  //   const coinmarketcapRates = await this.coinmarketcapProvider.get();
  //   const coingeckoRates: Partial<CurrencyData> | null =
  //     await this.coingeckoProvider.get();
  //   return { coinmarketcapRates, coingeckoRates };
  // }

  // async getRates() {
  //   const rates = await this.currencyRepo.find();
  //   return rates;
  // }
}
