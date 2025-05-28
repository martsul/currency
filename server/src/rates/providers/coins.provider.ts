import { CoinFiat } from 'src/common/types/coin-fiat.type';
import { CurrencyData } from 'src/common/types/currency-data.type';
import { FiatCoin } from 'src/common/types/fiat-coin.type';
import { ShortCoinsNames } from 'src/common/types/short-coins-manes.type';
import { ShortFiatsNames } from 'src/common/types/short-fiats-names.type';

export class CoinsProvider {
  protected countAllRates(
    coinFiatRates: Partial<CoinFiat>,
  ): Partial<CurrencyData> {
    const coinFiat = { ...coinFiatRates };
    const fiatCoin = this.countFiatCoin(coinFiat);
    const coins = Object.keys(coinFiat) as ShortCoinsNames[];
    coins.forEach((coin, i) => {
      for (let j = i + 1; j < coins.length; j++) {
        this.countRates(coinFiat, coin, coins[j]);
      }
    });
    return { ...coinFiat, ...fiatCoin };
  }

  private countFiatCoin(coinFiat: Partial<CoinFiat>): Partial<FiatCoin> {
    const fiatCoin: Partial<FiatCoin> = {};
    const coins = Object.keys(coinFiat) as ShortCoinsNames[];
    for (const coin of coins) {
      const fiatRates = coinFiat[coin];
      if (!fiatRates) continue;
      for (const fiat of Object.keys(fiatRates) as ShortFiatsNames[]) {
        const price = fiatRates[fiat];
        if (price === undefined || price === 0) continue;
        if (!fiatCoin[fiat]) {
          fiatCoin[fiat] = {};
        }
        fiatCoin[fiat][coin] = 1 / price;
      }
    }

    return fiatCoin;
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
