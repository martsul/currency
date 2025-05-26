/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admins } from 'src/entities/admins.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthData } from 'src/common/types/auth-data';
import { AdminDTO } from 'src/common/types/admin-dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(Admins)
    private adminsRepo: Repository<Admins>,
  ) {}

  async onModuleInit() {
    const admin = await this.findMainAdmin();
    if (!admin) {
      await this.initAdmin();
      this.logger.log('Admin Was Initialized');
    }
  }

  private async findMainAdmin() {
    return await this.adminsRepo.findOne({ where: { name: 'admin' } });
  }

  private async initAdmin() {
    const admin = this.adminsRepo.create({
      name: 'admin',
      password: '$2b$13$X7I.RRX6bmhXxHarLgIGUeRRbgz0C2denc72ZRUwFs/E1IkdBc0Nm',
    });
    await this.adminsRepo.save(admin);
  }

  private async findAdmin(name: string) {
    const admin = await this.adminsRepo.findOne({ where: { name } });
    if (!admin) {
      throw new NotFoundException('Invalid Name');
    }
    return admin;
  }

  async logIn(adminData: AuthData) {
    const admin = await this.findAdmin(adminData.name);
    await this.checkPassword(adminData.password, admin.password);
    const dto = this.convertToDTO(admin);
    const jwt = this.createJWT(dto);
    return jwt;
  }

  private async checkPassword(password: string, hash: string) {
    const isTruthful = await bcrypt.compare(password, hash);
    if (!isTruthful) {
      throw new NotFoundException('Invalid Password');
    }
  }

  private convertToDTO(admin: Admins): AdminDTO {
    return { id: admin.id, name: admin.name };
  }

  private createJWT(dto: AdminDTO) {
    const token = jwt.sign(dto, process.env.ACCESS_TOKEN_KEY as string, {
      expiresIn: '4h',
    });
    return token;
  }
}
