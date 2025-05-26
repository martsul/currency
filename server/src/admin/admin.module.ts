import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rates } from 'src/entities/rates.entity';
import { Settings } from 'src/entities/settings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rates, Settings])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
