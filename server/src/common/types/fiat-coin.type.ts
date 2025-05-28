import { ShortCoinsNames } from './short-coins-manes.type';
import { ShortFiatsNames } from './short-fiats-names.type';

export type FiatCoin = Record<
  ShortFiatsNames,
  Partial<Record<ShortCoinsNames, number>>
>;
