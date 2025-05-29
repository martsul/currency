import { Controller, Get, Param } from '@nestjs/common';
import { RatesService } from './rates.service';

@Controller('rates')
export class RatesController {
  constructor(private readonly ratesService: RatesService) {}

  @Get()
  async getRates() {
    return await this.ratesService.getAll();
  }

  @Get(':from/:to')
  async getPair(@Param('from') from: string, @Param('to') to: string) {
    return await this.ratesService.getPair(from, to);
  }

  @Get('/fiat')
  async getFiat() {
    return await this.ratesService.getFiat();
  }
  @Get('/coins')
  async getCoins() {
    return await this.ratesService.getCoins();
  }

  @Get('/test')
  async test() {}
}
