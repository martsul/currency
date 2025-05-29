import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrencyData } from 'src/common/types/currency-data.type';
import { ShortCoinsNames } from 'src/common/types/short-coins-manes.type';
import { ShortFiatsNames } from 'src/common/types/short-fiats-names.type';
import { CurrencyService } from 'src/currency/currency.service';
import { Settings } from 'src/entities/settings.entity';
import { CoingeckoProvider } from 'src/currency/providers/coingecko.provider';
import { CoinmarketcapProvider } from 'src/currency/providers/coinmarketcap.provider';
import { Repository } from 'typeorm';
import { Currency } from 'src/common/types/currency.type';
import { TatumProvider } from 'src/currency/providers/tatum.provider';
import { CoinbaseProvider } from 'src/currency/providers/coinbase.provider';
import { BinanceProvider } from 'src/currency/providers/binance.provider';

type Rates = Record<Currency, number[]>;

type UnityRates = Record<Currency, Partial<Rates>>;

@Injectable()
export class AggregatorService {
  private readonly logger = new Logger(AggregatorService.name);

  constructor(
    private readonly coingeckoProvider: CoingeckoProvider,
    private readonly coinmarketcapProvider: CoinmarketcapProvider,
    private readonly tatumProvider: TatumProvider,
    private readonly coinbaseProvider: CoinbaseProvider,
    private readonly binanceProvider: BinanceProvider,
    private readonly currencyService: CurrencyService,
    @InjectRepository(Settings)
    private settingsRepo: Repository<Settings>,
  ) {}

  private async onModuleInit() {
    await this.currencyService.initSettings();
    await this.currencyService.initRates();
    await this.updateRates();
    this.logger.log('Initial Rate Update');
  }

  @Cron('*/5 * * * *')
  async updateRates() {
    const crudRates = await this.queryRates();
    const countedRates = await this.countRates(crudRates);
    await this.currencyService.saveRates(countedRates);
    this.logger.log('Rates Updated');
  }

  private async queryRates() {
    return await Promise.allSettled([
      this.coingeckoProvider.get(),
      this.coinmarketcapProvider.get(),
      this.tatumProvider.get(),
      this.coinbaseProvider.get(),
      this.binanceProvider.get(),
    ]);
  }

  private async countRates(
    crudRates: Awaited<ReturnType<AggregatorService['queryRates']>>,
  ) {
    const validateRates = this.validateRates(crudRates);
    const unityRates = this.uniteRates(validateRates);
    const avgRates = await this.avgRates(unityRates);
    return avgRates;
  }

  private validateRates(
    crudRates: Awaited<ReturnType<AggregatorService['queryRates']>>,
  ) {
    const validateRates: Partial<CurrencyData>[] = [];
    crudRates.forEach((rates) => {
      if (rates.status === 'fulfilled' && rates.value) {
        validateRates.push(rates.value);
      }
    });
    return validateRates;
  }

  private uniteRates(allRates: Partial<CurrencyData>[]): Partial<UnityRates> {
    const unityRates: Partial<UnityRates> = {};
    for (const rates of allRates) {
      this.mergeSingleRateSet(unityRates, rates);
    }
    return unityRates;
  }

  private mergeSingleRateSet(
    target: Partial<UnityRates>,
    source: Partial<CurrencyData>,
  ): void {
    const fromKeys = Object.keys(source) as ShortCoinsNames[] &
      ShortFiatsNames[];
    fromKeys.forEach((from) => {
      const fromRates = source[from];
      if (!fromRates) return;
      if (!target[from]) {
        target[from] = {};
      }
      this.mergeFromRates(target[from], fromRates);
    });
  }

  private mergeFromRates(
    targetRates: Partial<Record<Currency, number[]>>,
    sourceRates: Partial<Record<Currency, number>>,
  ): void {
    for (const to in sourceRates) {
      const toKey = to as Currency;
      const rateValue = sourceRates[toKey];
      if (rateValue === undefined) continue;
      if (!targetRates[toKey]) {
        targetRates[toKey] = [];
      }
      targetRates[toKey].push(rateValue);
    }
  }

  private async avgRates(unityRates: Partial<UnityRates>) {
    const difSetting = await this.settingsRepo.findOne({
      where: { name: 'dif_percent' },
    });
    const avgRates: Partial<CurrencyData> = {};
    const difPercents = Number(difSetting?.value) || 100;
    for (const coin of Object.keys(unityRates) as ShortCoinsNames[]) {
      if (unityRates[coin]) {
        const avg = this.iterateAvgRates(unityRates[coin], difPercents);
        avgRates[coin] = avg;
      }
    }
    return avgRates;
  }

  private iterateAvgRates(unityRates: Partial<Rates>, difPercents: number) {
    const avgRate: Partial<Record<Currency, number>> = {};
    (Object.keys(unityRates) as Currency[]).forEach((coin) => {
      const rates = unityRates[coin];
      if (!rates) {
        avgRate[coin] = NaN;
      } else if (rates.length === 1) {
        avgRate[coin] = rates[0];
      } else if (rates.length > 1 && rates.length < 4) {
        avgRate[coin] = this.oneMinMax(rates, difPercents);
      } else if (rates.length >= 4 && rates.length <= 5) {
        avgRate[coin] = this.twoMinMax(rates, difPercents);
      } else {
        avgRate[coin] = this.threeMinMax(rates, difPercents);
      }
    });
    return avgRate;
  }

  private oneMinMax(rates: number[], difPercents: number): number {
    const countedDifPercent = this.countDifPercent(
      Math.min(...rates),
      Math.max(...rates),
    );
    if (countedDifPercent < difPercents) {
      return this.countAvgRates(rates);
    }
    return NaN;
  }

  private twoMinMax(rates: number[], difPercents: number): number {
    const sortedRates = rates.sort((a, b) => a - b);
    const minAvg = this.countAvgRates([sortedRates[0], sortedRates[1]]);
    const maxAvg = this.countAvgRates([
      sortedRates[sortedRates.length - 1],
      sortedRates[sortedRates.length - 2],
    ]);
    const countedDifPercent = this.countDifPercent(minAvg, maxAvg);
    if (countedDifPercent < difPercents) {
      return this.countAvgRates(rates);
    }
    return NaN;
  }

  private threeMinMax(rates: number[], difPercents: number): number {
    const sortedRates = rates.sort((a, b) => a - b);
    const minAvg = this.countAvgRates([
      sortedRates[0],
      sortedRates[1],
      sortedRates[2],
    ]);
    const maxAvg = this.countAvgRates([
      sortedRates[sortedRates.length - 1],
      sortedRates[sortedRates.length - 2],
      sortedRates[sortedRates.length - 3],
    ]);
    const countedDifPercent = this.countDifPercent(minAvg, maxAvg);
    if (countedDifPercent < difPercents) {
      return this.countAvgRates(sortedRates.slice(1, sortedRates.length - 1));
    }
    return NaN;
  }

  private countDifPercent(min: number, max: number) {
    return (Math.abs(max - min) / ((min + max) / 2)) * 100;
  }

  private countAvgRates(rates: number[]) {
    const sum = rates.reduce((acc, value) => acc + value, 0);
    return sum / rates.length;
  }
}
