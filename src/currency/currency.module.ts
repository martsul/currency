import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyRate } from 'src/rates/entities/currency-rate.entity';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CurrencyRate])],
  providers: [CurrencyService],
  exports: [CurrencyService],
})
export class CurrencyModule {
  constructor(
    @InjectRepository(CurrencyRate)
    private currencyRepo: Repository<CurrencyRate>,
  ) {}
}
