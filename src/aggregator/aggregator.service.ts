import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrencyData } from 'src/common/types/currency-data.type';
import { ShortCoinsNames } from 'src/common/types/short-coins-manes.type';
import { ShortFiatsNames } from 'src/common/types/short-fiats-names.type';
import { CurrencyService } from 'src/currency/currency.service';
import { Settings } from 'src/entities/settings.entity';
import { CoingeckoProvider } from 'src/rates/providers/coingecko.provider';
import { CoinmarketcapProvider } from 'src/rates/providers/coinmarketcap.provider';
import { Repository } from 'typeorm';

type Rates = Record<ShortCoinsNames | ShortFiatsNames, number[]>;

type UnityRates = Record<ShortCoinsNames, Partial<Rates>>;

@Injectable()
export class AggregatorService {
  private readonly logger = new Logger(AggregatorService.name);
  private readonly shortCoins = new Set([
    'btc',
    'eth',
    'sol',
    'xmr',
    'ltc',
    'usdt',
    'trx',
  ]);

  constructor(
    private readonly coingeckoProvider: CoingeckoProvider,
    private readonly coinmarketcapProvider: CoinmarketcapProvider,
    private readonly currencyService: CurrencyService,
    @InjectRepository(Settings)
    private settingsRepo: Repository<Settings>,
  ) {}

  private async onModuleInit() {
    await this.currencyService.initSettings();
    await this.currencyService.initRates();
    await this.updateRates();
    this.logger.log('Initial Rate Update');
  }

  @Cron('*/5 * * * *')
  async updateRates() {
    this.logger.log('Rates Update');
    // const crudRates = await this.queryRates();
    const crudRates = JSON.parse(
      '[{"status":"fulfilled","value":{"btc":{"usd":107206,"eur":94290,"rub":8505927,"uah":4451509,"ngn":170435792,"cny":769802,"brl":605263,"eth":43.20348832523313,"ltc":1134.6951735817104,"xmr":266.08587738893027,"sol":626.3496143958869,"usdt":107206,"trx":394772.50298272225},"eth":{"usd":2481.42,"eur":2182.47,"rub":196881,"uah":103036,"ngn":3944967,"cny":17818.11,"brl":14009.62,"btc":0.02314627912616831,"ltc":26.26397121083827,"xmr":6.1588979895755775,"sol":14.497663005375088,"usdt":2481.42,"trx":9137.514545374202},"ltc":{"usd":94.48,"eur":83.1,"rub":7496.22,"uah":3923.08,"ngn":150204,"cny":678.42,"brl":533.41,"btc":0.0008812939574277559,"eth":0.03807497320082856,"xmr":0.234499875899727,"sol":0.5519981304043001,"usdt":94.48,"trx":347.9106214373039},"xmr":{"usd":402.9,"eur":354.36,"rub":31967,"uah":16729.73,"ngn":640534,"cny":2893.08,"brl":2274.71,"btc":0.0037581851762028243,"eth":0.16236670938414294,"ltc":4.264394580863675,"sol":2.3539378359429772,"usdt":402.9,"trx":1483.6281686821521},"sol":{"usd":171.16,"eur":150.54,"rub":13580.5,"uah":7107.25,"ngn":272117,"cny":1229.06,"brl":966.36,"btc":0.0015965524317668788,"eth":0.06897663434646291,"ltc":1.8116003386960202,"xmr":0.42482005460412015,"usdt":171.16,"trx":630.2749996317626},"usdt":{"usd":1,"eur":0.879701,"rub":79.36,"uah":41.53,"ngn":1590.12,"cny":7.18,"brl":5.65,"btc":0.000009327836128574893,"eth":0.0004029950592805732,"ltc":0.010584250635055038,"xmr":0.002482005460412013,"sol":0.005842486562280907,"trx":3.6823732158901765},"trx":{"usd":0.271564,"eur":0.238847,"rub":21.55,"uah":11.28,"ngn":431.73,"cny":1.95,"brl":1.53,"btc":0.0000025331044904203125,"eth":0.00010943895027846959,"ltc":0.0028743014394580864,"xmr":0.0006740233308513279,"sol":0.0015866090207992524,"usdt":0.271564}}},{"status":"fulfilled","value":{"btc":{"usd":107061.98586495254,"ngn":170207145.1272968,"eur":94163.47899390107,"cny":768769.295701882,"uah":4445537.087372625,"kzt":54776818.660336256,"rub":8494515.829669084,"brl":604450.5597963523,"eth":43.27390176359193,"ltc":1136.7214424818087,"sol":627.286124009461,"trx":394361.37197414413,"usdt":107034.25134336711,"xmr":265.6622574167727},"eth":{"usd":2474.0543723059445,"ngn":3933251.641073394,"eur":2175.987723693651,"cny":17765.194825780152,"uah":102730.21165641306,"kzt":1265816.495114896,"rub":196296.50859945937,"brl":13968.016175164978,"btc":0.023108616492754995,"ltc":26.268059873403374,"sol":14.495714470961385,"trx":9113.145704507195,"usdt":2473.4134658830167,"xmr":6.139087223243758},"ltc":{"usd":94.18489162235178,"ngn":149735.14070050692,"eur":82.83777843436607,"cny":676.3040327834625,"uah":3910.841232718075,"kzt":48188.427360657326,"rub":7472.820967574054,"brl":531.7490611214766,"btc":0.0008797230021602265,"eth":0.038069046774653816,"sol":0.5518380322270552,"trx":346.9287700891199,"usdt":94.16049292575917,"xmr":0.2337091986553462},"sol":{"usd":170.6748830671373,"ngn":271338.929098852,"eur":150.11248517985845,"cny":1225.548065351892,"uah":7086.93675377008,"kzt":87323.4981035705,"rub":13541.692545937723,"brl":963.596254820449,"btc":0.0015941688517007871,"eth":0.06898590628307802,"ltc":1.8121259166648873,"trx":628.6786155151683,"usdt":170.630669556709,"xmr":0.4235104958463355},"trx":{"usd":0.2714819286914641,"ngn":431.60197023164903,"eur":0.23877460036850362,"cny":1.9494031371619367,"uah":11.272749826177428,"kzt":138.90006109403544,"rub":21.539928688112024,"brl":1.5327326730062762,"btc":0.0000025357453114489214,"eth":0.00010973159350512945,"ltc":0.0028824360681967013,"sol":0.0015906378478939573,"usdt":0.27141160100838857,"xmr":0.0006736518236735179},"usdt":{"usd":1.0002591181910214,"ngn":1590.2119460925674,"eur":0.8797509004087256,"cny":7.182460624082484,"uah":41.53378037009192,"kzt":511.76906432139737,"rub":79.36259396460464,"brl":5.647262929482899,"btc":0.000009342803704881238,"eth":0.00040429956972155346,"ltc":0.010620165304236989,"sol":0.005860611123416184,"trx":3.684440887142082,"xmr":0.0024820303228405374},"xmr":{"usd":403.0003618353396,"ngn":640689.9752427938,"eur":354.448087242505,"cny":2893.784398194854,"uah":16733.79248749828,"kzt":206189.6905980213,"rub":31974.868813761645,"brl":2275.259442849973,"btc":0.003764177906653836,"eth":0.16289066495322121,"ltc":4.278821739809703,"sol":2.361216569146931,"trx":1484.4463636227686,"usdt":402.89596416193615}}}]',
    ) as Awaited<ReturnType<AggregatorService['queryRates']>>;
    const countedRates = await this.countRates(crudRates);
    await this.currencyService.save(countedRates);
  }

  private async queryRates() {
    return await Promise.allSettled([
      this.coingeckoProvider.get(),
      this.coinmarketcapProvider.get(),
    ]);
  }

  private async countRates(
    crudRates: Awaited<ReturnType<AggregatorService['queryRates']>>,
  ) {
    const validateRates = this.validateRates(crudRates);
    const unityRates = this.uniteRates(validateRates);
    const avgRates = await this.avgRates(unityRates);
    return avgRates;
  }

  private validateRates(
    crudRates: Awaited<ReturnType<AggregatorService['queryRates']>>,
  ) {
    const validateRates: Partial<CurrencyData>[] = [];
    crudRates.forEach((rates) => {
      if (rates.status === 'fulfilled' && rates.value) {
        validateRates.push(rates.value);
      }
    });
    return validateRates;
  }

  private uniteRates(allRates: Partial<CurrencyData>[]): Partial<UnityRates> {
    const unityRates: Partial<UnityRates> = {};
    for (const rates of allRates) {
      this.mergeSingleRateSet(unityRates, rates);
    }
    return unityRates;
  }

  private mergeSingleRateSet(
    target: Partial<UnityRates>,
    source: Partial<CurrencyData>,
  ): void {
    for (const from in source) {
      if (!this.isShortCoin(from)) continue;
      const fromKey = from;

      const fromRates = source[fromKey];
      if (!fromRates) continue;

      if (!target[fromKey]) {
        target[fromKey] = {};
      }

      this.mergeFromRates(target[fromKey], fromRates);
    }
  }

  private mergeFromRates(
    targetRates: Partial<Record<ShortCoinsNames | ShortFiatsNames, number[]>>,
    sourceRates: Partial<Record<ShortCoinsNames | ShortFiatsNames, number>>,
  ): void {
    for (const to in sourceRates) {
      const toKey = to as ShortCoinsNames | ShortFiatsNames;
      const rateValue = sourceRates[toKey];
      if (rateValue === undefined) continue;
      if (!targetRates[toKey]) {
        targetRates[toKey] = [];
      }
      targetRates[toKey].push(rateValue);
    }
  }

  private isShortCoin(key: string): key is ShortCoinsNames {
    return this.shortCoins.has(key);
  }

  private async avgRates(unityRates: Partial<UnityRates>) {
    const difSetting = await this.settingsRepo.findOne({
      where: { name: 'dif_percent' },
    });
    const avgRates: Partial<CurrencyData> = {};
    const difPercents = Number(difSetting?.value) || 100;
    for (const coin of Object.keys(unityRates) as ShortCoinsNames[]) {
      if (unityRates[coin]) {
        const avg = this.iterateAvgRates(unityRates[coin], difPercents);
        avgRates[coin] = avg;
      }
    }
    return avgRates;
  }

  private iterateAvgRates(unityRates: Partial<Rates>, difPercents: number) {
    const avgRate: Partial<Record<ShortCoinsNames | ShortFiatsNames, number>> =
      {};
    (Object.keys(unityRates) as (ShortCoinsNames | ShortFiatsNames)[]).forEach(
      (coin) => {
        const rates = unityRates[coin];
        if (!rates) {
          avgRate[coin] = NaN;
        } else if (rates.length === 1) {
          avgRate[coin] = rates[0];
        } else if (rates.length > 1 && rates.length < 4) {
          avgRate[coin] = this.oneMinMax(rates, difPercents);
        } else if (rates.length >= 4 && rates.length <= 5) {
          avgRate[coin] = this.twoMinMax(rates, difPercents);
        } else {
          avgRate[coin] = this.threeMinMax(rates, difPercents);
        }
      },
    );
    return avgRate;
  }

  private oneMinMax(rates: number[], difPercents: number): number {
    const countedDifPercent = this.countDifPercent(
      Math.min(...rates),
      Math.max(...rates),
    );
    if (countedDifPercent < difPercents) {
      return this.countAvgRates(rates);
    }
    return NaN;
  }

  private twoMinMax(rates: number[], difPercents: number): number {
    const sortedRates = rates.sort((a, b) => a - b);
    const minAvg = this.countAvgRates([sortedRates[0], sortedRates[1]]);
    const maxAvg = this.countAvgRates([
      sortedRates[sortedRates.length - 1],
      sortedRates[sortedRates.length - 2],
    ]);
    const countedDifPercent = this.countDifPercent(minAvg, maxAvg);
    if (countedDifPercent < difPercents) {
      return this.countAvgRates(rates);
    }
    return NaN;
  }

  private threeMinMax(rates: number[], difPercents: number): number {
    const sortedRates = rates.sort((a, b) => a - b);
    const minAvg = this.countAvgRates([
      sortedRates[0],
      sortedRates[1],
      sortedRates[2],
    ]);
    const maxAvg = this.countAvgRates([
      sortedRates[sortedRates.length - 1],
      sortedRates[sortedRates.length - 2],
      sortedRates[sortedRates.length - 3],
    ]);
    const countedDifPercent = this.countDifPercent(minAvg, maxAvg);
    if (countedDifPercent < difPercents) {
      return this.countAvgRates(sortedRates.slice(1, sortedRates.length - 1));
    }
    return NaN;
  }

  private countDifPercent(min: number, max: number) {
    return (Math.abs(max - min) / ((min + max) / 2)) * 100;
  }

  private countAvgRates(rates: number[]) {
    const sum = rates.reduce((acc, value) => acc + value, 0);
    return sum / rates.length;
  }
}
