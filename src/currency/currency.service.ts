import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrencyRate } from './entities/currenct-rate.entity';
import { Repository } from 'typeorm';
import { CoingeckoProvider } from './providers/coingecko.provider';
import { CoinmarketcapProvider } from './providers/coinmarketcap.provider';
import { CurrencyData } from 'src/common/types/currency-data.type';
// import { AlphavantageProvider } from './providers/alphavantage.provider';

@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);

  constructor(
    @InjectRepository(CurrencyRate)
    private currencyRepo: Repository<CurrencyRate>,
    // private readonly alphavantageProvider: AlphavantageProvider,
    private readonly coinmarketcapProvider: CoinmarketcapProvider,
    private readonly coingeckoProvider: CoingeckoProvider,
  ) {}

  async saveRate(from: string, to: string, rate: number) {
    const entry = this.currencyRepo.create({ from, to, rate });
    await this.currencyRepo.save(entry);
    this.logger.log(`Saved: ${from} - ${to} = ${rate}`);
  }

  async fetchRates() {
    // const alphavantageRates: CurrencyData | null = await this.alphavantageProvider.get();
    const coinmarketcapRates = await this.coinmarketcapProvider.get();
    const coingeckoRates: Partial<CurrencyData> | null =
      await this.coingeckoProvider.get();
    return { coingeckoRates };
  }
}
