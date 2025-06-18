import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ALL_COINS } from 'src/common/constants/all-coins';
import { Currency } from 'src/common/types/currency.type';
import { ShortCoinsNames } from 'src/common/types/short-coins-manes.type';
import { CurrencyService } from 'src/currency/currency.service';
import { Rates } from 'src/entities/rates.entity';
import { Settings } from 'src/entities/settings.entity';

@Injectable()
export class RatesService {
  private readonly logger = new Logger(RatesService.name);

  constructor(
    private currencyService: CurrencyService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async getAll() {
    const cache = await this.getCache('*');
    if (cache) {
      return cache as Partial<Record<Currency, number>>;
    }
    const [pairs, settings] =
      await this.currencyService.getAllPairsAndSettings();
    const result: Partial<Record<Currency, number>> = {};
    pairs.forEach((pair) => {
      const rate = this.countPair(pairs, settings, pair.from, pair.to);
      result[`${pair.from}/${pair.to}`] = rate;
    });
    await this.setInCache('*', result);
    return result;
  }

  async getFiat() {
    const cache = await this.getCache('fiat');
    if (cache) {
      return cache as Partial<Record<Currency, number>>;
    }
    const [pairs, settings] = await this.currencyService.getFiatRates();
    const result: Partial<Record<Currency, number>> = {};
    pairs.forEach((pair) => {
      const rate = this.countPair(pairs, settings, pair.from, pair.to);
      result[`${pair.from}/${pair.to}`] = rate;
    });
    await this.setInCache('fiat', result);
    return result;
  }

  async getCoins() {
    const cache = await this.getCache('coins');
    if (cache) {
      return cache as Partial<Record<Currency, number>>;
    }
    const [pairs, settings] = await this.currencyService.getCoinsRates();
    const result: Partial<Record<Currency, number>> = {};
    pairs.forEach((pair) => {
      const rate = this.countPair(pairs, settings, pair.from, pair.to);
      result[`${pair.from}/${pair.to}`] = rate;
    });
    await this.setInCache('fiat', result);
    return result;
  }

  async getPair(from: string, to: string) {
    const cache = await this.getCache(from + to);
    if (cache) {
      return cache as Partial<Record<Currency, number>>;
    }
    const fromValues = from.split(',');
    const toValues = to.split(',');
    const result: Partial<Record<Currency, number>> = {};
    const [pairs, settings] = await this.currencyService.getPairAndSettings(
      fromValues,
      toValues,
    );
    fromValues.forEach((from) => {
      toValues.forEach((to) => {
        if (from !== to) {
          const rate = this.countPair(pairs, settings, from, to);
          result[`${from}/${to}`] = rate;
        }
      });
    });
    await this.setInCache(from + to, result);
    return result;
  }

  private async getCache(key: string) {
    return await this.cache.get(key);
  }

  private async setInCache(
    key: string,
    result: Partial<Record<Currency, number>>,
  ) {
    await this.cache.set(key, result, 300000);
  }

  private countPair(
    pairs: Rates[],
    settings: Settings[],
    from: string,
    to: string,
  ) {
    const { currentPair, otherPair } = this.findPairs(pairs, from, to);
    if (currentPair.typePrice === 'static') return currentPair.staticRate;
    if (currentPair.error) return currentPair.error;
    const settingsPercent = this.countSettingsPercent(from, to, settings);
    const rateByOtherPair = this.handlerOtherPair(otherPair);
    return this.getOwnRate(
      currentPair,
      rateByOtherPair,
      settingsPercent,
    ).toFixed(8);
  }

  private getOwnRate(
    currentPair: Rates,
    rateByOtherPair: number,
    settingsPercent: number,
  ) {
    const percent =
      currentPair.typePrice === 'percent'
        ? 1 + (currentPair.percent || 0) / 100
        : 1 + (settingsPercent || 0) / 100;
    if (Number.isNaN(rateByOtherPair)) {
      return currentPair.rate * percent;
    } else {
      return rateByOtherPair * percent;
    }
  }

  private countSettingsPercent(
    from: string,
    to: string,
    settings: Settings[],
  ): number {
    const coinCoinSetting = settings.find(
      (s) => s.name === 'coin_coin_percent',
    );
    const coinFiatSetting = settings.find(
      (s) => s.name === 'coin_fiat_percent',
    );
    if (!coinCoinSetting || !coinFiatSetting) {
      throw new InternalServerErrorException('Settings not initial');
    }
    const isCoinCoinRate = this.checkIsCoinCoinRate(from, to);
    return isCoinCoinRate ? +coinCoinSetting.value : +coinFiatSetting.value;
  }

  private checkIsCoinCoinRate(from: string, to: string) {
    return (
      ALL_COINS.has(from as ShortCoinsNames) &&
      ALL_COINS.has(to as ShortCoinsNames)
    );
  }

  private findPairs(pairs: Rates[], from: string, to: string) {
    const currentPair = pairs.find(
      (pair) => pair.from === from && pair.to === to,
    );
    const otherPair = pairs.find(
      (pair) => pair.from !== from && pair.to !== to,
    );
    if (!currentPair || !otherPair) {
      throw new NotFoundException('Pairs not found');
    }
    return { currentPair, otherPair };
  }

  private handlerOtherPair(pair: Rates) {
    if (pair.typePrice === 'static' && pair.isAffect) {
      return 1 / pair.staticRate;
    }
    return NaN;
  }
}
