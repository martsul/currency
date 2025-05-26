import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminService } from './admin.service';
import { Rates } from 'src/entities/rates.entity';
import { Settings } from 'src/entities/settings.entity';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAllData() {
    return await this.adminService.getAllData();
  }

  @UseGuards(AuthGuard)
  @Post('rate')
  async updateRate(@Body() body: Rates) {
    return await this.adminService.updateRate(body);
  }

  @UseGuards(AuthGuard)
  @Post('settings')
  async updateSettings(@Body() body: Settings) {
    return await this.adminService.updateSettings(body);
  }
}
