import { CurrencyData } from 'src/common/types/currency-data.type';
import { ShortCoinsNames } from 'src/common/types/short-coins-manes.type';
import { ShortFiatsNames } from 'src/common/types/short-fiats-names.type';

export class CoinsProvider {
  protected countAllRates(
    coinFiatRates: Partial<CurrencyData>,
  ): Partial<CurrencyData> {
    const allRates = { ...coinFiatRates };
    const fiats = Object.keys(coinFiatRates);
    fiats.forEach((fiat, i) => {
      for (let j = i + 1; j < fiats.length; j++) {
        this.countRates(
          allRates,
          fiat as ShortCoinsNames,
          fiats[j] as ShortCoinsNames,
        );
      }
    });
    return allRates;
  }

  private countRates(
    allRates: Partial<CurrencyData>,
    firstKey: ShortCoinsNames,
    secondKey: ShortCoinsNames,
  ): void {
    const first = allRates[firstKey]?.usd;
    const second = allRates[secondKey]?.usd;
    const rate1 = first && second ? first / second : NaN;
    const rate2 = first && second ? second / first : NaN;
    this.setRate(allRates, firstKey, secondKey, rate1);
    this.setRate(allRates, secondKey, firstKey, rate2);
  }

  private setRate(
    rates: Partial<CurrencyData>,
    from: ShortCoinsNames,
    to: ShortCoinsNames,
    value: number,
  ): void {
    if (!rates[from]) {
      rates[from] = {} as Record<ShortFiatsNames | ShortCoinsNames, number>;
    }
    rates[from][to] = value;
  }
}
