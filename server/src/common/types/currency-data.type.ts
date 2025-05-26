import { ShortCoinsNames } from './short-coins-manes.type';
import { ShortFiatsNames } from './short-fiats-names.type';

export type CurrencyData = Record<
  ShortCoinsNames,
  Partial<Record<ShortCoinsNames | ShortFiatsNames, number>>
>;
