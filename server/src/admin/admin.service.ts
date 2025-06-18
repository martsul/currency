import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Rates } from 'src/entities/rates.entity';
import { Settings } from 'src/entities/settings.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(Rates)
    private ratesRepo: Repository<Rates>,
    @InjectRepository(Settings)
    private settingsRepo: Repository<Settings>,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async getAllData() {
    const [rates, settings] = await Promise.all([
      this.getRates(),
      this.getSettings(),
    ]);
    return { rates, settings };
  }

  async updateRate(rates: Rates) {
    await this.cache.clear();
    return await this.ratesRepo.update({ id: rates.id }, rates);
  }

  async updateSettings(settings: Settings) {
    await this.cache.clear();
    return await this.settingsRepo.update({ id: settings.id }, settings);
  }

  private async getRates() {
    return await this.ratesRepo.find({ order: { from: 'ASC' } });
  }

  private async getSettings() {
    return await this.settingsRepo.find();
  }
}
