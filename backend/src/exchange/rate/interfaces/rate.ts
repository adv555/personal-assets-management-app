import { CurrencyEntity } from '../../currency/entities/currency.entity';
import { Base } from 'src/common/dto/base.dto';

export type MonobankRate = {
  currencyCodeA: number;
  currencyCodeB: number;
  date: number;
} & (
  | {
      rateSell?: never;
      rateBuy?: never;
      rateCross: number;
    }
  | {
      rateSell: number;
      rateBuy: number;
      rateCross?: never;
    }
);

export type NbuRate = {
  cc: string;
  r030: number;
  rate: number;
  exchangedate: string;
  txt: string;
};

export type PrivatbankRate = {
  baseCurrency: string;
  currency: string;
  purchaseRate?: number;
  purchaseRateNB: number;
  saleRate?: number;
  saleRateNB: number;
};

export type MonobankResponse = Array<MonobankRate>;
export type NbuResponse = Array<NbuRate>;
export type PrivatbankResponse = {
  bank: string;
  baseCurrency: number;
  baseCurrencyLit: string;
  date: string;
  exchangeRate: Array<PrivatbankRate>;
};

export interface CurrencyWithCode {
  currencyCode: string;
  currencyNumber?: never;
}

export interface CurrencyWithNumber {
  currencyCode?: never;
  currencyNumber: number;
}

export type Currency = CurrencyWithCode | CurrencyWithNumber;

export type CrossRateOnly = {
  sellRate?: undefined;
  buyRate?: undefined;
  crossRate: number;
};

export type PairRateOnly = {
  sellRate: number;
  buyRate: number;
  crossRate?: undefined;
};

export type PairOrCrossRate = CrossRateOnly | PairRateOnly;

export type ExchangeRate = Currency & PairOrCrossRate;

export type ExchangeCurrency = Omit<CurrencyEntity, keyof Base>;
