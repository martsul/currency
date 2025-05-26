import { Module } from '@nestjs/common';
import { RatesController } from './rates.controller';
import { RatesService } from './rates.service';
import { CurrencyModule } from 'src/currency/currency.module';

@Module({
  imports: [CurrencyModule],
  providers: [RatesService],
  controllers: [RatesController],
})
export class RatesModule {}
