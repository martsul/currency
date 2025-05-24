import { Module } from '@nestjs/common';
import { AggregatorService } from './aggregator.service';
import { CurrencyModule } from 'src/currency/currency.module';
import { CoingeckoProvider } from 'src/rates/providers/coingecko.provider';
import { CoinmarketcapProvider } from 'src/rates/providers/coinmarketcap.provider';

@Module({
  imports: [CurrencyModule],
  providers: [AggregatorService, CoingeckoProvider, CoinmarketcapProvider],
})
export class AggregatorModule {}
