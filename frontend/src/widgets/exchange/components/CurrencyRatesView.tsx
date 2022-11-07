import React, { useCallback, useEffect, useRef } from 'react'
import clsx from 'clsx'
import {
  ExchangeWidgetView,
  fetchCurrencyRates,
  ICurrencyRate,
  IExchangeBank,
  IExchangeCurrency,
  setSelectedBank,
  setSelectedCurrency,
  setSelectedRate,
  setView,
} from 'redux/slice/widgets/exchangeSlice'
import HeaderButton from './HeaderButton'
import { ExchangeCurrenciesEnum } from 'common/enums/exchange-currencies.enum'
import { Typography } from 'components/common/Typography'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import useDropdown from 'hooks/useDropdown'
import CellButton from './CellButton'

const primaryCurrencies = [
  ExchangeCurrenciesEnum.USD,
  ExchangeCurrenciesEnum.EUR,
  ExchangeCurrenciesEnum.PLN,
  ExchangeCurrenciesEnum.GBP,
]

const CurrencyRatesView = () => {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isDropdownOpen, toggleDropdown] = useDropdown(dropdownRef)

  const dispatch = useAppDispatch()
  const rates = useAppSelector((state) => state.exchange.currencyRates)
  const currencies = useAppSelector((state) => state.exchange.currencies)
  const selectedCurrency = useAppSelector(
    (state) => state.exchange.selectedCurrency,
  )

  const onCurrencySelect = useCallback((currency: IExchangeCurrency) => {
    dispatch(setSelectedCurrency(currency))
  }, [])

  const onDropdownItemSelect = useCallback((currency: IExchangeCurrency) => {
    dispatch(setSelectedCurrency(currency))
    toggleDropdown()
  }, [])

  const onBankSelect = useCallback((bank: IExchangeBank) => {
    dispatch(setSelectedBank(bank))
    dispatch(setView(ExchangeWidgetView.BANK_RATES))
  }, [])

  const onRateSelect = useCallback(
    (rate: ICurrencyRate) => {
      if (selectedCurrency) {
        dispatch(setSelectedRate({ ...rate, currency: selectedCurrency }))
        dispatch(setView(ExchangeWidgetView.HISTORY))
      }
    },
    [selectedCurrency],
  )

  useEffect(() => {
    if (selectedCurrency)
      dispatch(
        fetchCurrencyRates({
          currencyId: selectedCurrency.id,
        }),
      )
  }, [selectedCurrency])

  const getPrimaryCurrencies = (): (IExchangeCurrency | undefined)[] =>
    primaryCurrencies.map((currencyCode) =>
      currencies.find((o) => o.currencyCode === currencyCode.toString()),
    )

  const getSecondaryCurrencies = (): IExchangeCurrency[] =>
    currencies.filter(
      (currency) =>
        !primaryCurrencies.find(
          (currencyCode) => currencyCode === currency.currencyCode,
        ),
    )

  return (
    <>
      <div className="flex flex-row gap-1 py-1 px-4">
        {getPrimaryCurrencies().map(
          (currency) =>
            currency && (
              <HeaderButton
                key={currency.id}
                title={currency.currencyName}
                onClick={() => onCurrencySelect(currency)}
                isActive={currency.id === selectedCurrency?.id}
              >
                {currency.currencyCode}
              </HeaderButton>
            ),
        )}
        <HeaderButton onClick={() => toggleDropdown()} className="ml-auto">
          <div className="flex items-center">
            More
            <svg
              className="ml-2 w-4 h-4"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </HeaderButton>
        {isDropdownOpen && (
          <div
            className="z-10 w-44 max-h-[200px] bg-white rounded-lg shadow absolute right-[10px] top-[41px] overflow-x-hidden"
            ref={dropdownRef}
          >
            <ul className="py-1 text-sm text-black">
              {getSecondaryCurrencies().map((currency) => (
                <li key={currency.id}>
                  <Typography
                    type="Ag-14-medium"
                    className={clsx(
                      'block py-2 px-4 hover:bg-gray-200 cursor-pointer',
                      selectedCurrency?.id === currency.id &&
                        'underline bg-gray-300 pointer-events-none',
                    )}
                    onClick={() => onDropdownItemSelect(currency)}
                  >
                    {`${currency.currencyCode} (${currency.currencyName})`}
                  </Typography>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="overflow-x-auto relative">
        <table className="w-full text-sm text-left text-gray-200">
          <colgroup>
            <col span={1} />
            <col span={1} className="w-1/4" />
            <col span={1} />
            <col span={1} className="w-1/4" />
            <col span={1} className="w-1/4" />
          </colgroup>
          <thead className="text-Ag-10 text-gray-400 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="py-3 px-6">
                <div className="text-left">Bank</div>
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
                    onClick={() => onBankSelect(rate.bank)}
                  >
                    {rate.bank.name}
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

export default CurrencyRatesView
