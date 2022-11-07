import { Typography } from 'components/common/Typography'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React from 'react'
import {
  chengeApiCurrency,
  selectCurrency,
  selectCurrency2,
} from 'redux/slice/cryptoWidgetSlice'
import DropDown from 'ui/dropdown/DropDown'
import CryptoItem from './CryptoItem'

/*eslint-disable */
const SelectInput = () => {
  const {
    coins,
    select,
    select2,
    selectValue,
    selectValue2,
    chooseCurrency,
    currency,
  } = useAppSelector((state) => state.cryptoWidgetSlice)
  const dispatch = useAppDispatch()
  const [valueInput, setValueInput] = React.useState<number>(0)
  const [result, setResult] = React.useState<number>(0)

  const convertor = React.useCallback(
    (e: any) => {
      setValueInput(e)
    },
    [valueInput, result],
  )

  React.useEffect(() => {
    const res = Number(
      ((Number(valueInput) * selectValue) / selectValue2).toFixed(3),
    )
    setResult(res)
  }, [valueInput])

  return (
    <div className="relative">
      <div
        className=" p-4 border rounded-md shadow-md fixed top-31"
        style={{ border: '1px solid #F2F3F4', maxWidth: '500px' }}
      >
        <form className=" p-1  my-2 bg-slate-100 rounded-xl flex items-center justify-center">
          <input
            className="bg-transparent "
            style={{ width: '100%', border: 'none' }}
            placeholder="Suma"
            type="number"
            value={valueInput ? valueInput : ''}
            onChange={(e) => {
              convertor(e.target.value)
            }}
          />
          <DropDown
            options={coins}
            select={select}
            setSelect={selectCurrency}
          />
        </form>
        <form className=" p-1  my-2 bg-slate-100 rounded-xl flex items-center justify-center">
          <input
            className="bg-transparent outline-none	 "
            style={{ width: '100%', outline: 'none', border: 'none' }}
            placeholder="Suma"
            value={result}
            readOnly
            type="number"
          />
          <DropDown
            options={coins}
            select2={select2}
            setSelect={selectCurrency2}
          />
        </form>
        <div className="flex items-center justify-center">
          <DropDown
            select={currency}
            options={chooseCurrency}
            chengeCurrencyFunction={chengeApiCurrency}
          />
        </div>
      </div>
    </div>
  )
}

/*eslint-enable */
export default SelectInput
