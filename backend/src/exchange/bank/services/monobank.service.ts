import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { ExchangeRate, MonobankResponse } from '../../rate/interfaces/rate';
import { BankService } from './bank.service';

@Injectable()
export class MonobankService extends BankService {
  protected getBankName() {
    return 'monobank';
  }

  async fetchCurrentRate(): Promise<Array<ExchangeRate>> {
    const response = await firstValueFrom(
      this.httpService.get<MonobankResponse>(
        this.configService.get('api.monobank'),
      ),
    );

    this.logger.verbose(
      `Received data from Monobank api. ${response.statusText}`,
    );

    return response.data.map((item) =>
      !item.rateCross
        ? {
            currencyNumber: item.currencyCodeA,
            sellRate: item.rateSell,
            buyRate: item.rateBuy,
          }
        : {
            currencyNumber: item.currencyCodeA,
            crossRate: item.rateCross,
          },
    );
  }
}
