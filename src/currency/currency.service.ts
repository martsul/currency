import { Injectable } from '@nestjs/common';

@Injectable()
export class CurrencyService {
  getAll() {
    return { data: 'all' };
  }

  getOne() {
    return { data: 'one' };
  }

  save() {
    return { data: 'saved' };
  }
}
