import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyRate } from './entities/currenct-rate.entity';
import { CoingeckoProvider } from './providers/coingecko.provider';
import { AlphavantageProvider } from './providers/alphavantage.provider';
import { CoinmarketcapProvider } from './providers/coinmarketcap.provider';

@Module({
  imports: [TypeOrmModule.forFeature([CurrencyRate])],
  controllers: [CurrencyController],
  providers: [
    CurrencyService,
    CoingeckoProvider,
    AlphavantageProvider,
    CoinmarketcapProvider,
  ],
})
export class CurrencyModule {}
