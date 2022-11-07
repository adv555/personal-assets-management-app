import {
  AnyAction,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
import api from 'axios/axios'
import { stringifyUrl } from 'query-string'
import { ExchangeCurrenciesEnum } from 'common/enums/exchange-currencies.enum'
import { LoadingStatus } from '../../../common/enums/loading-status'

export interface IExchangeCurrency {
  id: number
  createdAt: Date
  updatedAt: Date
  currencyCode: string
  currencyNumber: number
  currencyName: string
}

export interface IExchangeBank {
  id: number
  createdAt: Date
  updatedAt: Date
  name: string
  apiUrl: string
}

export interface IExchangeRate {
  id: number
  createdAt: Date
  updatedAt: Date
  buyRate: number
  sellRate: number
  crossRate: number
}

export interface ICurrencyRate extends IExchangeRate {
  bank: IExchangeBank
}

export interface IBankRate extends IExchangeRate {
  currency: IExchangeCurrency
}

export interface IRateHistory extends IExchangeRate {
  bank: IExchangeBank
  currency: IExchangeCurrency
}

export interface IPaginationDto {
  limit?: number
  offset?: number
}

export interface IFetchCurrencyRatesDto extends IPaginationDto {
  currencyId: number
}

export interface IFetchBankRatesDto extends IPaginationDto {
  bankId: number
  currencyCodes?: ExchangeCurrenciesEnum[]
}

export interface IFetchRateHistory extends IPaginationDto {
  bankId: number
  currencyId: number
}

export interface IFetchCurrenciesDto extends IPaginationDto {
  currencyCodes?: ExchangeCurrenciesEnum[]
}

export enum ExchangeWidgetView {
  CURRENCY_RATES = 'CURRENCY_RATES',
  BANK_RATES = 'BANK_RATES',
  HISTORY = 'HISTORY',
}

interface IExchangeState {
  currencyRates: ICurrencyRate[]
  bankRates: IBankRate[]
  rateHistory: IRateHistory[]
  banks: IExchangeBank[]
  currencies: IExchangeCurrency[]
  status: string
  selectedBank?: IExchangeBank | undefined
  selectedCurrency?: IExchangeCurrency | undefined
  selectedRate?: IRateHistory | undefined
  view: ExchangeWidgetView
}

export const fetchCurrencyRates = createAsyncThunk<
  ICurrencyRate[],
  IFetchCurrencyRatesDto
>('exchange/fetchCurrencyRates', async (params) => {
  const { currencyId, ...query } = params
  const url = stringifyUrl(
    {
      url: `/exchange/currencies/${currencyId}/rates`,
      query,
    },
    {
      skipEmptyString: true,
      arrayFormat: 'comma',
    },
  )
  const { data } = await api.get<ICurrencyRate[]>(url)

  return data
})

export const fetchBankRates = createAsyncThunk<IBankRate[], IFetchBankRatesDto>(
  'exchange/fetchBankRates',
  async (params) => {
    const { bankId, ...query } = params
    const url = stringifyUrl(
      {
        url: `/exchange/banks/${bankId}/rates`,
        query,
      },
      {
        skipEmptyString: true,
        arrayFormat: 'comma',
      },
    )
    const { data } = await api.get<IBankRate[]>(url)

    return data
  },
)

export const fetchRateHistory = createAsyncThunk<
  IRateHistory[],
  IFetchRateHistory
>('exchange/fetchRateHistory', async (params) => {
  const { currencyId, bankId, ...query } = params
  const url = stringifyUrl(
    {
      url: `/exchange/currencies/${currencyId}/banks/${bankId}/history`,
      query,
    },
    {
      skipEmptyString: true,
      arrayFormat: 'comma',
    },
  )
  const { data } = await api.get<IRateHistory[]>(url)

  return [...data].sort(
    (a, b) => +new Date(a.createdAt) - +new Date(b.createdAt),
  )
})

export const fetchCurrencies = createAsyncThunk<
  IExchangeCurrency[],
  IFetchCurrenciesDto
>('exchange/fetchCurrencies', async (params) => {
  const url = stringifyUrl(
    {
      url: '/exchange/currencies',
      query: { ...params },
    },
    {
      skipEmptyString: true,
      arrayFormat: 'comma',
    },
  )
  const { data } = await api.get<IExchangeCurrency[]>(url)

  return data
})

const initialState: IExchangeState = {
  currencyRates: [],
  bankRates: [],
  rateHistory: [],
  banks: [],
  currencies: [],
  status: LoadingStatus.SUCCESS,
  view: ExchangeWidgetView.CURRENCY_RATES,
}

function isError(action: AnyAction) {
  return action.type.endsWith('rejected')
}

function isLoading(action: AnyAction) {
  return action.type.endsWith('pending')
}

const exchangeSlice = createSlice({
  name: 'exchange',
  initialState,
  reducers: {
    setSelectedCurrency(
      state,
      action: PayloadAction<IExchangeCurrency | undefined>,
    ) {
      state.selectedCurrency = action.payload
    },
    setSelectedBank(state, action: PayloadAction<IExchangeBank | undefined>) {
      state.selectedBank = action.payload
    },
    setSelectedRate(state, action: PayloadAction<IRateHistory>) {
      state.selectedRate = action.payload
    },
    setView(state, action: PayloadAction<ExchangeWidgetView>) {
      state.view = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrencyRates.fulfilled, (state, action) => {
        state.currencyRates = action.payload
        state.status = LoadingStatus.SUCCESS
      })
      .addCase(fetchBankRates.fulfilled, (state, action) => {
        state.bankRates = action.payload
        state.status = LoadingStatus.SUCCESS
      })
      .addCase(fetchRateHistory.fulfilled, (state, action) => {
        state.rateHistory = action.payload
        state.status = LoadingStatus.SUCCESS
      })
      .addCase(fetchCurrencies.fulfilled, (state, action) => {
        state.currencies = action.payload
        state.status = LoadingStatus.SUCCESS
      })
      .addMatcher(isLoading, (state) => {
        state.status = LoadingStatus.LOADING
      })
      .addMatcher(isError, (state, action: PayloadAction<string>) => {
        state.status = LoadingStatus.ERROR
      })
  },
})

export const {
  setSelectedCurrency,
  setSelectedBank,
  setSelectedRate,
  setView,
} = exchangeSlice.actions

export default exchangeSlice.reducer
