import { Typography } from 'components/common/Typography'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getOneCoin } from 'redux/thunk/cryptoThunk'
import OneCoinInfo from '../cryptoComponents/cryptoColum/OneCoinInfo'
import style from './CryptoDashboard.module.scss'
/*eslint-disable */

const CoinById = () => {
  const dispatch = useAppDispatch()
  const { oneCoin, coins, currency } = useAppSelector(
    (state) => state.cryptoWidgetSlice,
  )

  const { marker } = useParams<string>()

  useEffect(() => {
    dispatch(getOneCoin({ marker, currency }))
  }, [])

  return (
    <div>
      <div>
        <div className="flex gap-4 items-center ">
          <div className=" flex gap-4 items-center ">
            <img
              src={
                process.env.REACT_APP_CRYPTO_API + oneCoin.IMAGEURL
                  ? process.env.REACT_APP_CRYPTO_API + oneCoin.IMAGEURL
                  : ''
              }
              alt="photo"
              width={70}
              height={70}
            />
            <Typography type={'h1'} children={oneCoin.FROMSYMBOL} />
          </div>

          <div className=" ml-32">
            <Typography
              type={'Ag-16-semibold'}
              children={'Price: '}
              className="text-gray-400 my-2"
            />
            <div className=" flex items-center">
              <Typography
                type={'h2'}
                children={oneCoin.PRICE}
                className={'m-2 '}
              />
              <span
                className={`m-2 p-2 rounded-xl text-white ${
                  Number(oneCoin.CHANGEPCT24HOUR) > 0
                    ? 'bg-green-500'
                    : 'bg-red-500'
                }`}
              >
                {oneCoin.CHANGEPCT24HOUR} %
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 rounded-xl p-4 bg-gray-100 max-w-full md:grid-cols-4 ">
          <div className=" text-center ">
            <Typography
              type={'Ag-15-medium'}
              children={'Market Cap'}
              className="text-gray-400 my-4"
            />

            <Typography type={'Ag-16-semibold'} children={oneCoin.MKTCAP} />
          </div>

          <div className="border-l text-center">
            <Typography
              type={'Ag-15-medium'}
              children={'Circulating Supply'}
              className="text-gray-400 my-4"
            />
            <Typography
              type={'Ag-16-semibold'}
              children={oneCoin.CIRCULATINGSUPPLY}
            />
          </div>

          <div className="border-l text-center">
            <Typography
              type={'Ag-15-medium'}
              children={'Volume 24h'}
              className="text-gray-400 my-4"
            />
            <Typography
              type={'Ag-16-semibold'}
              children={oneCoin.VOLUME24HOURTO}
            />
          </div>

          <div className="border-l text-center">
            <Typography
              type={'Ag-15-medium'}
              children={'Volume 1h'}
              className="text-gray-400 my-4"
            />
            <Typography
              type={'Ag-16-semibold'}
              children={oneCoin.VOLUMEHOURTO}
            />
          </div>
        </div>
      </div>

      <OneCoinInfo marker={marker} />
    </div>
  )
}
/*eslint-enable */

export default CoinById
