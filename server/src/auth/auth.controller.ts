/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthData } from 'src/common/types/auth-data';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post()
  public async auth(@Body() body: AuthData) {
    const accessToken = await this.authService.logIn(body);
    return { accessToken };
  }
}
