import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admins } from 'src/entities/admins.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admins])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
