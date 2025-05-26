import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { initialRates } from 'src/common/constants/initil-rates.constant';
import { CurrencyData } from 'src/common/types/currency-data.type';
import { UpdateRate } from 'src/common/types/update-rate.type';
import { Rates } from 'src/entities/rates.entity';
import { Settings } from 'src/entities/settings.entity';
import { Repository } from 'typeorm';

type RatesFromTo = Record<string, number>;

@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);
  private oldRates = new Map<string, number>();

  constructor(
    @InjectRepository(Settings)
    private settingsRepo: Repository<Settings>,
    @InjectRepository(Rates)
    private ratesRepo: Repository<Rates>,
  ) {}

  async initSettings() {
    await Promise.all([
      this.initDifPercentSetting(),
      this.initCoinFiatSetting(),
      this.initCoinCoinSetting(),
    ]);
    this.logger.log('Settings was initiated');
  }

  async initRates() {
    const countRates = await this.ratesRepo.count();
    if (countRates === 0) {
      await this.ratesRepo.insert(initialRates);
      this.logger.log('Init Rates');
    }
  }

  private async initDifPercentSetting() {
    let setting = await this.settingsRepo.findOne({
      where: { name: 'dif_percent' },
    });
    if (!setting) {
      setting = this.settingsRepo.create({ name: 'dif_percent', value: '100' });
      await this.settingsRepo.save(setting);
    }
  }

  private async initCoinFiatSetting() {
    let setting = await this.settingsRepo.findOne({
      where: { name: 'coin_fiat_percent' },
    });
    if (!setting) {
      setting = this.settingsRepo.create({
        name: 'coin_fiat_percent',
        value: '0',
      });
      await this.settingsRepo.save(setting);
    }
  }

  private async initCoinCoinSetting() {
    let setting = await this.settingsRepo.findOne({
      where: { name: 'coin_coin_percent' },
    });
    if (!setting) {
      setting = this.settingsRepo.create({
        name: 'coin_coin_percent',
        value: '0',
      });
      await this.settingsRepo.save(setting);
    }
  }

  getAll() {
    return { data: 'all' };
  }

  getOne() {
    return { data: 'one' };
  }

  async save(rates: Partial<CurrencyData>) {
    await this.setOldRates();
    const maxDif = await this.settingsRepo.findOne({
      where: { name: 'dif_percent' },
    });
    const convertedRates = this.convertRatesForSave(
      rates,
      Number(maxDif?.value) || 100,
    );
    await this.saveQuery(convertedRates);
  }

  private async saveQuery(rates: UpdateRate[]) {
    await this.ratesRepo.upsert(rates, {
      conflictPaths: ['from', 'to'],
    });
  }

  private async setOldRates() {
    const oldRates = await this.queryOldRates();
    this.convertOldRates(oldRates);
  }

  private async queryOldRates() {
    return await this.ratesRepo.find();
  }

  private convertOldRates(oldRates: Rates[]) {
    oldRates.forEach((rate) => {
      const pair = rate.from + rate.to;
      this.oldRates.set(pair, +rate.rate);
    });
  }

  private convertRatesForSave(rates: Partial<CurrencyData>, maxDif: number) {
    let convertedRates: UpdateRate[] = [];
    Object.keys(rates).forEach((from) => {
      if (rates[from]) {
        const convertedRatesFrom = this.convertRatesForSaveFrom(
          rates[from] as RatesFromTo,
          from,
          maxDif,
        );
        convertedRates = [...convertedRates, ...convertedRatesFrom];
      }
    });
    return convertedRates;
  }

  private convertRatesForSaveFrom(
    rates: RatesFromTo,
    from: string,
    maxDif: number,
  ) {
    const convertedRatesFrom: UpdateRate[] = [];
    Object.keys(rates).forEach((to) => {
      const rate = rates[to];
      if (Number.isNaN(rate)) {
        convertedRatesFrom.push({
          id: from + to,
          from,
          to,
          error: 'There is a wide variation among the api',
        });
      } else {
        const convertedResult = this.checkDifAndCount(from, to, maxDif, rate);
        if (convertedResult) convertedRatesFrom.push(convertedResult);
      }
    });
    return convertedRatesFrom;
  }

  private checkDifAndCount(
    from: string,
    to: string,
    maxDif: number,
    rate: number,
  ): UpdateRate | undefined {
    const oldRate = this.oldRates.get(from + to);
    if (oldRate) {
      const dif = this.countDif(oldRate, rate);
      if (maxDif > dif) {
        return { id: from + to, from, to, error: null, rate };
      } else {
        return {
          id: from + to,
          from,
          to,
          error: 'Large variation with the previous value',
        };
      }
    } else if (oldRate === 0) {
      return { id: from + to, from, to, error: null, rate };
    }
  }

  private countDif(oldRate: number, newRate: number) {
    return (Math.abs(oldRate - newRate) / ((newRate + oldRate) / 2)) * 100;
  }
}
