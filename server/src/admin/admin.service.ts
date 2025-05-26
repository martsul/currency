import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
  ) {}

  async getAllData() {
    const [rates, settings] = await Promise.all([
      this.getRates(),
      this.getSettings(),
    ]);
    return { rates, settings };
  }

  async updateRate(rates: Rates) {
    return await this.ratesRepo.update({ id: rates.id }, rates);
  }

  async updateSettings(settings: Settings) {
    return await this.settingsRepo.update({ id: settings.id }, settings);
  }

  private async getRates() {
    return await this.ratesRepo.find();
  }

  private async getSettings() {
    return await this.settingsRepo.find();
  }
}
