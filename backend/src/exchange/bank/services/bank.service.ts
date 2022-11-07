import { Injectable, Logger } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob, CronTime } from 'cron';
import { addSeconds } from 'date-fns';
import { ExchangeRate } from '../../rate/interfaces/rate';
import { RatesService } from '../../rate/rates.service';

@Injectable()
export abstract class BankService {
  protected readonly logger = new Logger(BankService.name);
  private readonly interval = CronExpression.EVERY_DAY_AT_4PM;
  private readonly retryDelay = 60 * 5; // seconds
  private readonly maxTries = 3;
  private numberTries = 0;

  protected abstract getBankName(): string;
  abstract fetchCurrentRate(): Promise<Array<ExchangeRate>>;

  constructor(
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
    protected readonly ratesService: RatesService,
    private schedulerRegistry: SchedulerRegistry,
  ) {
    this.addCronJob();
  }

  private addCronJob() {
    const job = new CronJob(this.interval, () => {
      this.fetchCurrentRate()
        .then(this.onFetchSuccess)
        .catch(this.onFetchError);
    });
    this.schedulerRegistry.addCronJob(this.getBankName(), job);
    job.start();
  }

  private onFetchSuccess = (rates: ExchangeRate[]) => {
    this.ratesService.createMany(rates, this.getBankName()).then();
  };

  private onFetchError = (err) => {
    if (this.numberTries < this.maxTries) {
      this.retryFetchRates(err);
      return;
    }

    this.logger.error(
      `Failed to fetch rates from ${this.getBankName()}. Maximum retries reached. 
        Error: ${err.name} - ${err.message}`,
    );

    const job = this.schedulerRegistry.getCronJob(this.getBankName());
    job.stop();

    this.addCronJob(); // if maximum retries reached return to default logic
    this.numberTries = 0;
  };

  private retryFetchRates(err) {
    this.logger.warn(
      `Failed to fetch rates from ${this.getBankName()} API.
        Try #${this.numberTries + 1}. 
        Next try in ${this.retryDelay} seconds. 
        Error: ${err.name} - ${err.message}`,
    );

    const job = this.schedulerRegistry.getCronJob(this.getBankName());
    job.setTime(new CronTime(addSeconds(new Date(), this.retryDelay)));
    this.numberTries += 1;
  }
}
