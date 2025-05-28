import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrencyData } from 'src/common/types/currency-data.type';
import { ShortCoinsNames } from 'src/common/types/short-coins-manes.type';
import { ShortFiatsNames } from 'src/common/types/short-fiats-names.type';
import { CurrencyService } from 'src/currency/currency.service';
import { Settings } from 'src/entities/settings.entity';
import { CoingeckoProvider } from 'src/currency/providers/coingecko.provider';
import { CoinmarketcapProvider } from 'src/currency/providers/coinmarketcap.provider';
import { Repository } from 'typeorm';
import { Currency } from 'src/common/types/currency.type';

type Rates = Record<Currency, number[]>;

type UnityRates = Record<Currency, Partial<Rates>>;

@Injectable()
export class AggregatorService {
  private readonly logger = new Logger(AggregatorService.name);

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
    const crudRates = JSON.parse(
      `[{"status":"fulfilled","value":{"btc":{"usd":108469,"eur":95892,"rub":8632498,"uah":4509237,"ngn":172226500,"cny":780497,"brl":616341,"eth":40.637878583524405,"ltc":1124.613789528253,"xmr":306.799604016405,"sol":624.3538824612906,"usdt":108469,"trx":394391.1369346505},"eth":{"usd":2669.16,"eur":2359.68,"rub":212426,"uah":110962,"ngn":4238096,"cny":19206.23,"brl":15166.72,"btc":0.024607583733601304,"ltc":27.67402799377916,"xmr":7.54959694526941,"sol":15.363840442065273,"usdt":2669.16,"trx":9705.01292590963},"ltc":{"usd":96.45,"eur":85.27,"rub":7676.03,"uah":4009.62,"ngn":153144,"cny":694.02,"brl":548.05,"btc":0.000889194147636652,"eth":0.03613496380883874,"xmr":0.2728044123886296,"sol":0.5551718183388017,"usdt":96.45,"trx":350.69029084205664},"xmr":{"usd":353.55,"eur":312.55,"rub":28137,"uah":14697.56,"ngn":561361,"cny":2543.98,"brl":2008.92,"btc":0.0032594566189418175,"eth":0.13245740232882255,"ltc":3.665629860031104,"sol":2.035054394750475,"usdt":353.55,"trx":1285.5008017336354},"sol":{"usd":173.73,"eur":153.58,"rub":13826.09,"uah":7222.14,"ngn":275844,"cny":1250.07,"brl":987.15,"btc":0.001601655772617061,"eth":0.0650878928202131,"ltc":1.8012441679626747,"xmr":0.4913873568095036,"usdt":173.73,"trx":631.6788411403887},"usdt":{"usd":1,"eur":0.884341,"rub":79.61,"uah":41.59,"ngn":1588.32,"cny":7.2,"brl":5.68,"btc":0.000009219223925729932,"eth":0.0003746497025281362,"ltc":0.010368066355624676,"xmr":0.00282845424975251,"sol":0.005756058251309503,"trx":3.63598020572376},"trx":{"usd":0.275029,"eur":0.24314,"rub":21.89,"uah":11.43,"ngn":436.69,"cny":1.98,"brl":1.56,"btc":0.000002535553937069578,"eth":0.00010303953303661078,"ltc":0.002851518921721099,"xmr":0.0007779069438551832,"sol":0.0015830829447994017,"usdt":0.275029},"usd":{"btc":0.000009219223925729932,"eth":0.0003746497025281362,"ltc":0.010368066355624676,"xmr":0.00282845424975251,"sol":0.005756058251309503,"usdt":1,"trx":3.63598020572376},"eur":{"btc":0.000010428398615108665,"eth":0.00042378627610523465,"ltc":0.01172745396974317,"xmr":0.003199488081906895,"sol":0.0065112644875634845,"usdt":1.1307855227791088,"trx":4.1128567903265605},"rub":{"btc":1.1584132426094972e-7,"eth":0.000004707521678137328,"ltc":0.00013027567635874273,"xmr":0.00003554039165511604,"sol":0.00007232702810411332,"usdt":0.012561236025624922,"trx":0.04568296025582458},"uah":{"btc":2.2176700847615682e-7,"eth":0.000009012094230457273,"ltc":0.00024940019253694867,"xmr":0.00006803850435038198,"sol":0.00013846311481084553,"usdt":0.024044241404183694,"trx":0.08748906386701663},"ngn":{"btc":5.806307391719625e-9,"eth":2.359550137608964e-7,"ltc":0.000006529802016402863,"xmr":0.0000017813848842367034,"sol":0.000003625237453053175,"usdt":0.0006295960511735671,"trx":0.0022899539719251644},"cny":{"btc":0.0000012812349054512701,"eth":0.00005206643885864118,"ltc":0.00144088066626322,"xmr":0.00039308485129600074,"sol":0.0007999552025086596,"usdt":0.1388888888888889,"trx":0.5050505050505051},"brl":{"btc":0.0000016224784656545647,"eth":0.00006593383407882522,"ltc":0.0018246510354894628,"xmr":0.0004977799016386914,"sol":0.0010130172719444866,"usdt":0.17605633802816903,"trx":0.641025641025641}}},{"status":"fulfilled","value":{"btc":{"cny":777742.3756889779,"usd":108085.8268509857,"uah":4493323.133285015,"brl":614349.0312383277,"kzt":55374868.148115285,"rub":8601655.467991441,"eur":95564.08381029895,"ngn":171618675.87290016,"eth":40.64935241085454,"ltc":1124.038281744471,"sol":625.2195396650073,"trx":393136.07675387687,"usdt":108066.23642979263,"xmr":306.4000539246652},"eth":{"cny":19132.958572823376,"usd":2658.9802897357768,"uah":110538.61542171011,"brl":15113.37806882943,"kzt":1362257.0807137534,"rub":211606.21160829498,"eur":2350.9374231698857,"ngn":4221928.90401553,"btc":0.024600637911588757,"ltc":27.652058767960117,"sol":15.380799510549048,"trx":9671.39827420469,"usdt":2658.4983528774706,"xmr":7.5376367826919575},"ltc":{"cny":691.9180496966231,"usd":96.15849264781266,"uah":3997.4822977661606,"brl":546.5552563609114,"kzt":49264.21906394084,"rub":7652.457756725109,"eur":85.01853127456351,"ngn":152680.45462522283,"btc":0.0008896494151854262,"eth":0.036163672599983036,"sol":0.5562261978254751,"trx":349.75328077237936,"usdt":96.14106404105502,"xmr":0.27258862878686146},"sol":{"cny":1243.9508466189209,"usd":172.87659772901227,"uah":7186.792555607808,"brl":982.613293831949,"kzt":88568.67809631341,"rub":13757.816130635023,"eur":152.8488438821061,"ngn":274493.4618723744,"btc":0.0015994381758058938,"eth":0.0650161260677081,"ltc":1.7978297388893683,"trx":628.7968494467067,"usdt":172.84526406147597,"xmr":0.49006794331609405},"trx":{"cny":1.9783032432708638,"usd":0.2749323535592306,"uah":11.429434740221167,"brl":1.5626880043953366,"kzt":140.85420143922013,"rub":21.87958820522217,"eur":0.2430814403993936,"ngn":436.53759097856124,"btc":0.0000025436485205249956,"eth":0.00010339766512016932,"ltc":0.002859158312372782,"sol":0.0015903387570722145,"usdt":0.27488252241334643,"xmr":0.0007793740438542536},"usdt":{"cny":7.196904429944255,"usd":1.000181281608764,"uah":41.57934320405607,"brl":5.684930386536148,"kzt":512.415995759144,"rub":79.59614170129518,"eur":0.8843102801343883,"ngn":1588.0878389282634,"btc":0.000009253584033618768,"eth":0.0003761521984460262,"ltc":0.010401382697126912,"sol":0.005785521549750588,"trx":3.6379177228891977,"xmr":0.0028352986468972116},"xmr":{"cny":2538.323233716538,"usd":352.7604694141498,"uah":14664.890151715808,"brl":2005.055232103119,"kzt":180727.34465552785,"rub":28073.28314017313,"eur":311.89316903252035,"ngn":560113.0733322134,"btc":0.003263706997407614,"eth":0.132667575903394,"ltc":3.668531605483461,"sol":2.0405333865206514,"trx":1283.0809646350046,"usdt":352.6965320194198},"cny":{"btc":0.000001285772810198404,"eth":0.00005226583208204971,"ltc":0.001445257860289174,"sol":0.000803890284506029,"trx":0.5054836781982077,"usdt":0.13894862850189962,"xmr":0.00039396085837965935},"usd":{"btc":0.000009251906833063936,"eth":0.0003760840213296091,"ltc":0.010399497459497116,"sol":0.005784472931191769,"trx":3.637258354843141,"usdt":0.9998187512483012,"xmr":0.002834784752556768},"uah":{"btc":2.2255243398640505e-7,"eth":0.00000904661231900682,"ltc":0.00025015745549612854,"sol":0.00013914413032830707,"trx":0.08749339076944145,"usdt":0.024050403949200664,"xmr":0.0000681900777745},"brl":{"btc":0.0000016277391989767209,"eth":0.0000661665443321668,"ltc":0.001829641172345915,"sol":0.0010176943526789132,"trx":0.6399230026642062,"usdt":0.17590364912265957,"xmr":0.0004987393783417586},"kzt":{"btc":1.8058733744073675e-8,"eth":7.340758320566415e-7,"ltc":0.000020298708048169474,"sol":0.000011290673198402677,"trx":0.007099539735287975,"usdt":0.0019515393904097403,"xmr":0.000005533196992995345},"rub":{"btc":1.1625669078716406e-7,"eth":0.000004725759193927179,"ltc":0.00013067697095370219,"sol":0.00007268595469692781,"trx":0.04570469931245426,"usdt":0.012563423033150965,"xmr":0.00003562105632629019},"eur":{"btc":0.000010464182359400487,"eth":0.00042536223641871776,"ltc":0.01176214155912133,"sol":0.0065424112777150625,"trx":4.113847599211835,"usdt":1.1308248048954384,"xmr":0.00320622603919784},"ngn":{"btc":5.826871667163977e-9,"eth":2.3685855985137206e-7,"ltc":0.000006549626816704539,"sol":0.0000036430740214313354,"trx":0.002290753466977168,"usdt":0.0006296880912298024,"xmr":0.0000017853537930311465}}}]`,
    ) as Awaited<ReturnType<AggregatorService['queryRates']>>;
    const countedRates = await this.countRates(crudRates);
    await this.currencyService.saveRates(countedRates);
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
    const fromKeys = Object.keys(source) as ShortCoinsNames[] &
      ShortFiatsNames[];
    fromKeys.forEach((from) => {
      const fromRates = source[from];
      if (!fromRates) return;
      if (!target[from]) {
        target[from] = {};
      }
      this.mergeFromRates(target[from], fromRates);
    });
  }

  private mergeFromRates(
    targetRates: Partial<Record<Currency, number[]>>,
    sourceRates: Partial<Record<Currency, number>>,
  ): void {
    for (const to in sourceRates) {
      const toKey = to as Currency;
      const rateValue = sourceRates[toKey];
      if (rateValue === undefined) continue;
      if (!targetRates[toKey]) {
        targetRates[toKey] = [];
      }
      targetRates[toKey].push(rateValue);
    }
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
    const avgRate: Partial<Record<Currency, number>> = {};
    (Object.keys(unityRates) as Currency[]).forEach((coin) => {
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
    });
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
