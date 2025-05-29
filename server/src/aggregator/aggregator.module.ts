import { Module } from '@nestjs/common';
import { AggregatorService } from './aggregator.service';
import { CurrencyModule } from 'src/currency/currency.module';
import { CoingeckoProvider } from 'src/currency/providers/coingecko.provider';
import { CoinmarketcapProvider } from 'src/currency/providers/coinmarketcap.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Settings } from 'src/entities/settings.entity';
import { TatumProvider } from 'src/currency/providers/tatum.provider';
import { CoinbaseProvider } from 'src/currency/providers/coinbase.provider';
import { BinanceProvider } from 'src/currency/providers/binance.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Settings]), CurrencyModule],
  providers: [
    AggregatorService,
    CoingeckoProvider,
    TatumProvider,
    CoinbaseProvider,
    BinanceProvider,
    CoinmarketcapProvider,
  ],
})
export class AggregatorModule {}
