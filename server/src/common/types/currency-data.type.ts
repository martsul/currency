import { Currency } from './currency.type';

export type CurrencyData = Record<Currency, Partial<Record<Currency, number>>>;
