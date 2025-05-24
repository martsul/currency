import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ShortCoinsNames } from 'src/common/types/short-coins-manes.type';
import { ShortFiatsNames } from 'src/common/types/short-fiats-names.type';
import { CoingeckoProvider } from 'src/rates/providers/coingecko.provider';
import { CoinmarketcapProvider } from 'src/rates/providers/coinmarketcap.provider';

type AllRates = Record<
  ShortCoinsNames,
  Record<ShortCoinsNames | ShortFiatsNames, number[]>
>;

@Injectable()
export class AggregatorService {
  private readonly logger = new Logger(AggregatorService.name);

  constructor(
    private readonly coingeckoProvider: CoingeckoProvider,
    private readonly coinmarketcapProvider: CoinmarketcapProvider,
  ) {}

  @Cron('*/5 * * * *')
  async updateRates() {
    this.logger.log('Rates Update');
    const crudRates = await this.queryRates();
    const countedRates = this.countRates(crudRates);
    console.log(JSON.stringify(crudRates));
  }

  private async onModuleInit() {
    this.logger.log('Initial rate update');
    await this.updateRates();
  }

  private async queryRates() {
    return await Promise.allSettled([
      this.coingeckoProvider.get(),
      this.coinmarketcapProvider.get(),
    ]);
  }

  private countRates(
    crudRates: Awaited<ReturnType<AggregatorService['queryRates']>>,
  ) {
    const allSortedRates: Partial<AllRates> = {};
    crudRates.forEach((rates) => {
      for (const from in rates) {
        allSortedRates[from] = {};
        for (const to in rates[from]) {
          if (!allSortedRates[from][to]) {
            allSortedRates[from][to] = [];
          }
          allSortedRates[from][to].push(rates[from][to]);
        }
      }
    });
  }
}
