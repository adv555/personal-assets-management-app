import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { format } from 'date-fns';

import { ExchangeRate, PrivatbankResponse } from '../../rate/interfaces/rate';
import { BankService } from './bank.service';

@Injectable()
export class PrivatbankService extends BankService {
  protected getBankName() {
    return 'privatbank';
  }

  async fetchCurrentRate(): Promise<Array<ExchangeRate>> {
    const date = format(new Date(), 'dd.MM.yyyy');
    const url = `${this.configService.get('api.privatbank')}?date=${date}&json`;

    const response = await firstValueFrom(
      this.httpService.get<PrivatbankResponse>(url),
    );

    this.logger.verbose(
      `Received data from Privatbank api. ${response.statusText}`,
    );

    return response.data.exchangeRate.slice(1).map((item) =>
      item.saleRate
        ? {
            currencyCode: item.currency,
            sellRate: item.saleRate,
            buyRate: item.purchaseRate,
          }
        : {
            currencyCode: item.currency,
            crossRate: item.saleRateNB,
          },
    );
  }
}
