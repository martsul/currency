import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrencyRate } from './entities/currenct-rate.entity';
import { Repository } from 'typeorm';
import { CoingeckoRates } from './providers/coingecko-rates.provider';

@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);

  constructor(
    @InjectRepository(CurrencyRate)
    private currencyRepo: Repository<CurrencyRate>,
  ) {}

  async saveRate(from: string, to: string, rate: number) {
    const entry = this.currencyRepo.create({ from, to, rate });
    await this.currencyRepo.save(entry);
    this.logger.log(`Saved: ${from} - ${to} = ${rate}`);
  }

  async fetchRates() {
    const coingeckoRates = await new CoingeckoRates().get();
    return coingeckoRates;
  }
}
