import { Controller, Get, Param } from '@nestjs/common';
import { RatesService } from './rates.service';

@Controller('rates')
export class RatesController {
  constructor(private readonly ratesService: RatesService) {}

  @Get()
  getRates() {
    return this.ratesService.getAll();
  }

  @Get(':from/:to')
  getRate(@Param('from') from: string, @Param('to') to: string) {
    const data = this.ratesService.getOne();
    return { ...data, from, to };
  }
}
