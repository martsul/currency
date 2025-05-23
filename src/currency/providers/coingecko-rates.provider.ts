import axios from 'axios';

type CurrencyData = Record<string, Record<string, number>>;

export class CoingeckoRates {
  async get() {
    const coinFiatRates = await this.#queryRates();
    const allRates = this.#countAllRates(coinFiatRates);
    return allRates;
  }

  async #queryRates(): Promise<CurrencyData> {
    const response = await axios.get<CurrencyData>(
      'https://api.coingecko.com/api/v3/simple/price',
      {
        params: {
          ids: 'bitcoin,ethereum,litecoin,monero,solana,tether',
          vs_currencies: 'usd,eur,rub,kzt,uah,ngn,cny,brl',
        },
      },
    );

    return response.data;
  }

  #countAllRates(coinFiatRates: CurrencyData): CurrencyData {
    const fiats = Object.keys(coinFiatRates);
    fiats.forEach((fiat, i) => {
      for (let j = i + 1; j < fiats.length; j++) {
        const firstFiat = coinFiatRates[fiat];
        const secondFiat = coinFiatRates[fiats[j]];
        const fiatUsdFirst = firstFiat.usd;
        const fiatUsdSecond = secondFiat.usd;
        firstFiat[fiats[j]] = fiatUsdFirst / fiatUsdSecond;
        secondFiat[fiat] = fiatUsdSecond / fiatUsdFirst;
      }
    });
    return coinFiatRates;
  }
}
