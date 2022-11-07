import React, { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import {
  ExchangeWidgetView,
  fetchBankRates,
  IBankRate,
  IExchangeCurrency,
  setSelectedCurrency,
  setSelectedRate,
  setView,
} from 'redux/slice/widgets/exchangeSlice'
import { Typography } from 'components/common/Typography'
import HeaderButton from './HeaderButton'
import CellButton from './CellButton'

const BankRatesView = () => {
  const dispatch = useAppDispatch()
  const rates = useAppSelector((state) => state.exchange.bankRates)
  const selectedBank = useAppSelector((state) => state.exchange.selectedBank)

  const onCurrencySelect = useCallback((currency: IExchangeCurrency) => {
    dispatch(setSelectedCurrency(currency))
    dispatch(setView(ExchangeWidgetView.CURRENCY_RATES))
  }, [])

  const onBackClick = useCallback(
    () => dispatch(setView(ExchangeWidgetView.CURRENCY_RATES)),
    [],
  )

  const onRateSelect = useCallback(
    (rate: IBankRate) => {
      if (selectedBank) {
        dispatch(setSelectedRate({ ...rate, bank: selectedBank }))
        dispatch(setView(ExchangeWidgetView.HISTORY))
      }
    },
    [selectedBank],
  )

  useEffect(() => {
    if (selectedBank)
      dispatch(
        fetchBankRates({
          bankId: selectedBank.id,
        }),
      )
  }, [selectedBank])

  return (
    <>
      <div className="flex flex-row gap-1 py-1 px-4 items-center">
        <HeaderButton onClick={() => onBackClick()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </HeaderButton>
        <div className="text-Ag-14 font-medium py-1.5 uppercase">
          {selectedBank?.name}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-200">
          <colgroup>
            <col span={1} />
            <col span={1} className="w-1/4" />
            <col span={1} />
            <col span={1} className="w-1/4" />
            <col span={1} className="w-1/4" />
          </colgroup>
          <thead className="text-Ag-10 text-gray-400 uppercase bg-gray-700 sticky top-0">
            <tr>
              <th scope="col" className="py-3 px-6">
                <div className="text-left">Currency</div>
              </th>
              <th scope="col" className="py-3">
                <div className="text-right">Buy Rate</div>
              </th>
              <th scope="col" className="px-1">
                <Typography type={'Ag-12-medium'} className="text-center">
                  /
                </Typography>
              </th>
              <th scope="col" className="py-3">
                <div className="text-left">Sell Rate</div>
              </th>
              <th scope="col" className="py-3">
                <div className="text-left">Cross Rate</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {rates.map((rate) => (
              <tr className="order-b" key={rate.id}>
                <th scope="row" className="py-4 px-6">
                  <CellButton
                    className="text-left whitespace-nowrap"
                    onClick={() => onCurrencySelect(rate.currency)}
                  >
                    {rate.currency.currencyCode}
                  </CellButton>
                </th>
                <td className="py-4">
                  <div className="flex items-center justify-end">
                    {rate.buyRate ? (
                      <CellButton
                        className="text-right"
                        onClick={() => onRateSelect(rate)}
                      >
                        {rate.buyRate}
                      </CellButton>
                    ) : (
                      '--'
                    )}
                  </div>
                </td>
                <td className="py-4 px-1">
                  <Typography type={'Ag-12-medium'} className="text-center">
                    /
                  </Typography>
                </td>
                <td className="py-4">
                  <div className="flex items-center justify-start">
                    {rate.sellRate ? (
                      <CellButton
                        className="text-left"
                        onClick={() => onRateSelect(rate)}
                      >
                        {rate.sellRate}
                      </CellButton>
                    ) : (
                      '--'
                    )}
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center justify-start">
                    {rate.crossRate ? (
                      <CellButton
                        className="text-left"
                        onClick={() => onRateSelect(rate)}
                      >
                        {rate.crossRate}
                      </CellButton>
                    ) : (
                      '--'
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default BankRatesView
