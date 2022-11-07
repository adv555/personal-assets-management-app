import { SkipThrottle } from '@nestjs/throttler';
import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExchangeService } from './exchange.service';
import { BanksService } from './bank/services/banks.service';
import { BankEntity } from './bank/entities/bank.entity';
import { CurrencyEntity } from './currency/entities/currency.entity';
import { CurrenciesService } from './currency/currencies.service';
import { RatesService } from './rate/rates.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { GetBankRatesResponseDto } from './dto/get-bank-rates-response.dto';
import { GetCurrencyRatesResponseDto } from './dto/get-currency-rates-response.dto';
import { GetExchangeRateHistoryResponseDto } from './dto/get-exchange-rate-history-response.dto';
import { GetExchangeRateHistoryDto } from './dto/get-exchange-rate-history.dto';
import { CurrencyFilterQueryDto } from './dto/currency-filter-query.dto';
import { GetBankRatesDto } from './dto/get-bank-rates.dto';

@ApiTags('Exchange')
@SkipThrottle()
@Controller('exchange')
export class ExchangeController {
  constructor(
    private readonly exchangeService: ExchangeService,
    private readonly banksService: BanksService,
    private readonly currencyService: CurrenciesService,
    private readonly ratesService: RatesService,
  ) {}

  @ApiOperation({ summary: `Get all exchange rate providers` })
  @ApiResponse({ status: HttpStatus.OK, type: [BankEntity] })
  @Get('banks')
  async getAllBanks(): Promise<BankEntity[]> {
    return await this.banksService.getAll();
  }

  @ApiOperation({ summary: `Get all currencies that have exchange rates` })
  @ApiResponse({ status: HttpStatus.OK, type: [CurrencyEntity] })
  @Get('currencies')
  async getAllCurrencies(
    @Query() currencyFilter: CurrencyFilterQueryDto,
  ): Promise<CurrencyEntity[]> {
    return await this.currencyService.getAll(currencyFilter);
  }

  @ApiOperation({ summary: `Get current currency rates by bank id` })
  @ApiResponse({ status: HttpStatus.OK, type: [GetBankRatesResponseDto] })
  @Get('banks/:bankId/rates')
  async getBankRates(
    @Param('bankId') bankId: number,
    @Query() query: GetBankRatesDto,
  ): Promise<GetBankRatesResponseDto[]> {
    return await this.ratesService.getRatesByBankId(bankId, query);
  }

  @ApiOperation({
    summary: `Get current currency rate from all banks by currency id`,
  })
  @ApiResponse({ status: HttpStatus.OK, type: [GetBankRatesResponseDto] })
  @Get('currencies/:currencyId/rates')
  async getCurrencyRates(
    @Param('currencyId') currencyId: number,
    @Query() query: PaginationQueryDto,
  ): Promise<GetCurrencyRatesResponseDto[]> {
    return await this.ratesService.getRatesByCurrencyId(currencyId, query);
  }

  @ApiOperation({
    summary: `Get exchange rate history for a specific currency and bank`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [GetExchangeRateHistoryResponseDto],
  })
  @Get([
    'currencies/:currencyId/banks/:bankId/history',
    'banks/:bankId/currencies/:currencyId/history',
  ])
  async getExchangeRateHistory(
    @Param('currencyId') currencyId: number,
    @Param('bankId') bankId: number,
    @Query() query: GetExchangeRateHistoryDto,
  ): Promise<GetExchangeRateHistoryResponseDto[]> {
    return await this.ratesService.getExchangeRateHistory(
      currencyId,
      bankId,
      query,
    );
  }
}
