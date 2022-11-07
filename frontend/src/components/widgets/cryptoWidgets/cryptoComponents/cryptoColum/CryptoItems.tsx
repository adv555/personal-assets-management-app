import axios, { AxiosResponse } from 'axios'
import { Typography } from 'components/common/Typography'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React from 'react'
import { useDispatch } from 'react-redux'
import SelectInput from './SelectInput'
import CryptoItem from './CryptoItem'
import style from './CryptoItem.module.scss'
import CryptoSearchInput from './CryptoSearchInput'
import { addNewItemInPortfolio, getTenCoins } from 'redux/thunk/cryptoThunk'
import CryptoModal from './CryptoModal'
import { InputField } from 'components/common/inputs/InputField'
import { Input } from 'components/common/inputs/Input'
import { Button } from 'components/common/buttons/Button'
import CryptoModelInput from './CryptoModelInput'
import { notifyError, notifySuccess } from 'components/common/notifications'
import { ToastContainer, Zoom } from 'react-toastify'
/*eslint-disable */
const CryptoItems = () => {
  const dispatch = useAppDispatch()
  const { coins, currency, cryptoItemInModal } = useAppSelector(
    (state) => state.cryptoWidgetSlice,
  )
  const { status } = useAppSelector((state) => state.cryptoPortfolioSlice)

  const [searchValue, setSearchValue] = React.useState('')
  const [page, setPage] = React.useState(1)

  React.useEffect(() => {
    if (status === 'ERROR') {
      notifyError(`Error !!
      Restart the page and try again`)
    }
    if (status === 'SUCCESS') {
      notifySuccess('Succsesful')
    }
  }, [status])

  React.useEffect(() => {
    dispatch(getTenCoins(currency))
  }, [currency])

  const handleSearch = () => {
    return coins.filter(
      (coin) =>
        coin.fullName.toLocaleLowerCase().includes(searchValue) ||
        coin.marker.toLocaleLowerCase().includes(searchValue),
    )
  }

  const saveSearchValue = (event: string) => {
    setSearchValue(event)
  }

  return (
    <div className={style.container}>
      <div>
        <CryptoSearchInput
          searchValue={searchValue}
          setSearchValue={saveSearchValue}
        />
        <div className={style.items}>
          {/*  */}
          <table className=" table-fixed w-full leading-normal overflow-x-hidden">
            <thead className="text-xs text-gray-600 uppercase bg-gray-100 ">
              <tr className="bg">
                <th className="py-3 px-6 text-left	">#</th>
                <th className="text-left	">Name</th>
                <th className="text-left	">Full name</th>
                <th className="text-left	">Price</th>
                <th className="text-left	">Change 24h</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {handleSearch().map((el) => (
                <CryptoItem
                  id={el.id}
                  key={el.fullName}
                  marker={el.marker}
                  fullName={el.fullName}
                  price={el.price ? Number(el.price.toFixed(2)) : 0}
                  imageUrl={el.imageUrl}
                  changeDay={el.changeDay}
                />
              ))}
            </tbody>
          </table>
        </div>
        <CryptoModelInput />
      </div>
      <div className={style.exchanger}>
        <SelectInput />
      </div>
      <ToastContainer transition={Zoom} />
    </div>
  )
}

/*eslint-enable */

export default CryptoItems
