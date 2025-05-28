import { ShortCoinsNames } from './short-coins-manes.type';
import { ShortFiatsNames } from './short-fiats-names.type';

export type CoinFiat = Record<
  ShortCoinsNames,
  Partial<Record<ShortFiatsNames, number>>
>;
