import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { format } from 'date-fns';

import { ExchangeRate, NbuResponse } from '../../rate/interfaces/rate';
import { BankService } from './bank.service';

@Injectable()
export class NbuService extends BankService {
  protected getBankName() {
    return 'nbu';
  }

  async fetchCurrentRate(): Promise<Array<ExchangeRate>> {
    const date = format(new Date(), 'yyyyMMdd');
    const url = `${this.configService.get('api.nbu')}?date=${date}&json`;

    const response = await firstValueFrom(
      this.httpService.get<NbuResponse>(url),
    );

    this.logger.verbose(`Received data from NBU api. ${response.statusText}`);

    return response.data.map((item) => ({
      currencyNumber: item.r030,
      crossRate: item.rate,
    }));
  }
}
