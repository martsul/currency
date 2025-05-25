import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rates } from 'src/entities/rates.entity';
import { Settings } from 'src/entities/settings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rates, Settings])],
  providers: [CurrencyService],
  exports: [CurrencyService],
})
export class CurrencyModule {}
