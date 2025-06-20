import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { RatesModule } from './rates/rates.module';
import { AggregatorModule } from './aggregator/aggregator.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 300000,
      max: 100,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // TERN OFF
    }),
    ScheduleModule.forRoot(),
    RatesModule,
    AggregatorModule,
    AuthModule,
    AdminModule,
    ThrottlerModule.forRoot(),
  ],
  providers: [],
})
export class AppModule {}
