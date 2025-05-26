/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthData } from 'src/common/types/auth-data';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  private async auth(@Body() body: AuthData) {
    const accessToken = await this.authService.logIn(body);
    return { accessToken };
  }
}
