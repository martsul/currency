import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ALL_COINS } from 'src/common/constants/all-coins';
import { Currency } from 'src/common/types/currency.type';
import { CurrencyService } from 'src/currency/currency.service';
import { Rates } from 'src/entities/rates.entity';
import { Settings } from 'src/entities/settings.entity';

@Injectable()
export class RatesService {
  private readonly logger = new Logger(RatesService.name);

  constructor(private currencyService: CurrencyService) {}

  async getAll() {
    const [pairs, settings] =
      await this.currencyService.getAllPairsAndSettings();
    const result: Partial<Record<Currency, number>> = {};
    pairs.forEach((pair) => {
      const rate = this.countPair(pairs, settings, pair.from, pair.to);
      result[`${pair.from}/${pair.to}`] = rate;
    });
    return result;
  }

  async getFiat() {
    const [pairs, settings] = await this.currencyService.getFiatRates();
    const result: Partial<Record<Currency, number>> = {};
    pairs.forEach((pair) => {
      const rate = this.countPair(pairs, settings, pair.from, pair.to);
      result[`${pair.from}/${pair.to}`] = rate;
    });
    return result;
  }

  async getCoins() {
    const [pairs, settings] = await this.currencyService.getCoinsRates();
    const result: Partial<Record<Currency, number>> = {};
    pairs.forEach((pair) => {
      const rate = this.countPair(pairs, settings, pair.from, pair.to);
      result[`${pair.from}/${pair.to}`] = rate;
    });
    return result;
  }

  async getPair(from: string, to: string) {
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
    return result;
  }

  private countPair(
    pairs: Rates[],
    settings: Settings[],
    from: string,
    to: string,
  ) {
    const { currentPair, otherPair } = this.findPairs(pairs, from, to);
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
    const { typePrice } = currentPair;
    const percent =
      currentPair.typePrice === 'percent'
        ? 1 + (currentPair.percent || 0) / 100
        : 1 + (settingsPercent || 0) / 100;
    if (typePrice === 'static') {
      return +currentPair.staticRate;
    } else if (Number.isNaN(rateByOtherPair)) {
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
    return ALL_COINS.has(from) && ALL_COINS.has(to);
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
