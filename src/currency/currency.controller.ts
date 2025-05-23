import { Controller, Get } from '@nestjs/common';
import { CurrencyService } from './currency.service';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  async getRates() {
    const rates = await this.currencyService.fetchRates();
    return rates;
  }
}
