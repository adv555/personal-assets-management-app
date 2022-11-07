import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import {
  ExchangeWidgetView,
  fetchCurrencies,
  setSelectedCurrency,
} from 'redux/slice/widgets/exchangeSlice'
import CurrencyRatesView from './components/CurrencyRatesView'
import BankRatesView from './components/BankRatesView'
import RateHistoryView from './components/RateHistoryView'
import { ExchangeCurrenciesEnum } from 'common/enums/exchange-currencies.enum'

export const ExchangeWidget = () => {
  const dispatch = useAppDispatch()
  const { view, currencies, selectedCurrency } = useAppSelector(
    (state) => state.exchange,
  )

  useEffect(() => {
    dispatch(
      fetchCurrencies({
        currencyCodes: Object.values(ExchangeCurrenciesEnum),
      }),
    )
  }, [])

  useEffect(() => {
    if (currencies.length && !selectedCurrency) {
      dispatch(
        setSelectedCurrency(
          currencies.find(
            (o) => o.currencyCode === (ExchangeCurrenciesEnum.USD as string),
          ),
        ),
      )
    }
  }, [currencies])

  return (
    <div className="h-[430px] bg-gray-800 text-gray-200 h-full flex flex-col relative dark">
      {view === ExchangeWidgetView.CURRENCY_RATES && <CurrencyRatesView />}
      {view === ExchangeWidgetView.BANK_RATES && <BankRatesView />}
      {view === ExchangeWidgetView.HISTORY && <RateHistoryView />}
    </div>
  )
}
