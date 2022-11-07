import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import api from 'axios/axios'
import {
  addNewItemInPortfolio,
  getOneCoin,
  getStatisticsOneCoin,
  getTenCoins,
} from 'redux/thunk/cryptoThunk'

export type ConvertValue = {
  marker: string
  price: number
}

export type CoinType = {
  id: number
  marker: string
  fullName: string
  price: number
  imageUrl: string
  changeDay: number
}
export type AddcryptoItemInModal = {
  marker: string
  imageUrl: string
}

interface typeInfo {
  coins: CoinType[]
  status: string
  select: string
  select2: string
  selectValue: number
  selectValue2: number
  currency: string
  chooseCurrency: string[]
  cryptoItemInModal: AddcryptoItemInModal | any
  oneCoin: any
  statisticsDataForOneCoin: any
}
const initialState: typeInfo = {
  coins: [],
  status: 'SUCCESS',
  select: 'USDT',
  select2: 'USDT',
  selectValue: 1,
  selectValue2: 1,
  currency: 'USD',
  chooseCurrency: ['USD', 'EUR', 'UAH'],
  cryptoItemInModal: {},
  oneCoin: {},
  statisticsDataForOneCoin: [],
}
const cryptoWidgetSlice = createSlice({
  name: 'cryptoSlice',
  initialState,
  reducers: {
    selectCurrency: (state, action) => {
      state.select = <string>action.payload[0]
      state.selectValue = <number>action.payload[1]
    },
    selectCurrency2: (state, action) => {
      console.log(action.payload)
      state.select2 = action.payload[0]
      state.selectValue2 = action.payload[1]
    },
    chengeApiCurrency: (state, action) => {
      state.currency = action.payload
    },
    addCryptoItemInModal: (state, action) => {
      state.cryptoItemInModal = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTenCoins.pending, (state) => {
      state.status = 'LOADING'
    })
    builder.addCase(getTenCoins.fulfilled, (state, action) => {
      const coinsData = action.payload.Data.map((coin: any, id: number) => {
        const obj: CoinType = {
          id: id,
          marker: coin.CoinInfo.Name,
          fullName: coin.CoinInfo.FullName,
          imageUrl: `https://www.cryptocompare.com${coin.CoinInfo.ImageUrl}`,
          // prettier-ignore
          price:
            coin && coin.RAW?.USD
              ? coin.RAW.USD.PRICE
              : (coin.RAW
              ? (coin.RAW.EUR ? coin.RAW.EUR.PRICE :( coin.RAW.UAH ? (coin.RAW.UAH.PRICE ? coin.RAW.UAH.PRICE : 0  ) : 0)) : 0),

          // prettier-ignore
          changeDay:
            coin.DISPLAY && coin.DISPLAY.USD
              ? coin.DISPLAY.USD.CHANGEPCT24HOUR
              : coin.DISPLAY
              ? coin.DISPLAY.EUR
                ? coin.DISPLAY.EUR.CHANGEPCT24HOUR
                : coin.DISPLAY
                ? coin.DISPLAY.UAH
                  ? coin.DISPLAY.UAH.CHANGEPCT24HOUR
                  : 0
                : 0
              : 0,
        }

        return obj
      })

      state.coins = coinsData
      state.status = 'SUCCESS'
    })
    builder.addCase(getOneCoin.pending, (state) => {
      state.status = 'LOADING'
    })
    builder.addCase(getOneCoin.fulfilled, (state, action) => {
      const data =
        action.payload['data']['DISPLAY'] && action.payload['data']['DISPLAY']
      const mark = action.payload['marker']
      const curren = action.payload['currency']

      state.oneCoin = data[mark][curren]

      state.status = 'SUCCESS'
    })
    builder.addCase(getOneCoin.rejected, (state) => {
      state.status = 'ERROR'
    })
    builder.addCase(getStatisticsOneCoin.pending, (state) => {
      state.status = 'LOADING'
    })
    builder.addCase(getStatisticsOneCoin.fulfilled, (state, action) => {
      state.statisticsDataForOneCoin = action.payload['Data']['Data']
      state.status = 'SUCCESS'
    })
    builder.addCase(getStatisticsOneCoin.rejected, (state) => {
      state.status = 'ERROR'
    })
  },
})

export const {
  selectCurrency,
  selectCurrency2,
  chengeApiCurrency,
  addCryptoItemInModal,
} = cryptoWidgetSlice.actions

export default cryptoWidgetSlice.reducer
