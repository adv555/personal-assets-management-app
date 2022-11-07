import { Typography } from 'components/common/Typography'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React from 'react'
import {
  addCryptoItemInModal,
  CoinType,
  selectCurrency,
} from 'redux/slice/cryptoWidgetSlice'
import style from './CryptoItem.module.scss'
import { BsSearch } from 'react-icons/bs'
import { AiOutlinePlus } from 'react-icons/ai'
import { setModalWindow } from 'redux/slice/cryptoPortfolioSlice'
import CryptoModal from './CryptoModal'
import { useNavigate } from 'react-router-dom'
import { AppRoute } from 'common/enums/app-route.enum'
/*eslint-disable */

const CryptoItem: React.FC<CoinType> = (props) => {
  const dispatch = useAppDispatch()
  const { currency } = useAppSelector((state) => state.cryptoWidgetSlice)
  const [symbol, setSymbol] = React.useState('$')
  const navigate = useNavigate()

  const addMewCryptoItemInPortfolio = (marker: any, imageUrl: any) => {
    dispatch(addCryptoItemInModal({ marker, imageUrl }))
    dispatch(setModalWindow())
  }

  React.useEffect(() => {
    if (currency === 'USD') {
      setSymbol('$')
    }
    if (currency === 'EUR') {
      setSymbol('€')
    }
    if (currency === 'UAH') {
      setSymbol('₴')
    }
  }, [currency])

  const opetDataOneCoin = (marker: string) => {
    navigate(`${marker}`)
  }

  return (
    <tr
      onClick={() => dispatch(selectCurrency([props.marker, props.price]))}
      className={`bg-white border-b dark:bg-gray-500 dark:border-gray-500 ${
        props.changeDay >= 0 ? style.row : style.row
      } `}
    >
      <td className="py-4 px-6">{props.id + 1}</td>
      <td>
        <img src={props.imageUrl} alt="icon" width={'30px'} />
        <Typography type={'Ag-16-medium'} children={props.marker}></Typography>
      </td>
      <td>
        <Typography
          type={'Ag-15-regular'}
          children={props.fullName}
        ></Typography>
      </td>
      <td>
        <Typography
          type={'Ag-16-regular'}
          children={`${symbol}. ${props.price}`}
          className={props.changeDay >= 0 ? 'text-green' : 'text-error'}
        ></Typography>
      </td>
      <td className="">
        <Typography
          type={'Ag-14-medium'}
          children={`${
            props.changeDay >= 0 ? `+ ${props.changeDay}` : props.changeDay
          } %`}
          className={props.changeDay >= 0 ? 'text-green' : 'text-error'}
        ></Typography>
      </td>
      <td className="">
        <BsSearch
          size={25}
          style={{ marginRight: '1rem' }}
          onClick={() => opetDataOneCoin(props.marker)}
        />
      </td>
      <td>
        <AiOutlinePlus
          size={28}
          className={style.iconPlus}
          onClick={() =>
            addMewCryptoItemInPortfolio(props.marker, props.imageUrl)
          }
        />
      </td>
    </tr>
  )
}
/*eslint-enable */

export default CryptoItem
