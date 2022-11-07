import { AppDispatch } from 'redux/store'
import { stat } from 'fs'
import { createSlice } from '@reduxjs/toolkit'
import {
  checkEmailAndSendCode,
  checkEmailAndSendCodeAgain,
  refreshPassword,
  verifyCode,
} from '../thunk/authThunk'
import {
  addNewItemInPortfolio,
  createPortfolio,
  deleteCryptoItem,
  getPortfolio,
} from 'redux/thunk/cryptoThunk'
import { notifyError, notifySuccess } from 'components/common/notifications'

export interface CryptoItems {
  id: number
  amount: number
  marker: string
}

export type PortfolioDataType = {
  changesDay: string
  changes7Day: string
  changes30Day: string
  createdAt: string
  cryptoItem: CryptoItems[]
  id: number
  total_balance: string
  updatedAt: string
}

export interface CounterState {
  status: string
  havePortfolio: boolean
  portfolioInfo: PortfolioDataType | []
  portfolioCryptoList: any
  modalActive: boolean
  newPriceForItems: any
  totalBalans: any
  color: string[]
  priceData: number[]
  changeOneDay: number
  changeSevenDay: number
  statistics: any
}

const initialState: CounterState = {
  status: 'SUCCESS',
  havePortfolio: false,
  portfolioInfo: [],
  portfolioCryptoList: [],
  newPriceForItems: {},
  modalActive: false,
  totalBalans: 0,
  color: [],
  priceData: [],
  statistics: {},
  changeOneDay: 0,
  changeSevenDay: 0,
}
const cryptoPortfolioSlice = createSlice({
  name: 'cryptoPortfolio',
  initialState,
  reducers: {
    setModalWindow: (state) => {
      state.modalActive = !state.modalActive
    },

    chengeStatusPortfolio: (state) => {
      state.havePortfolio = false
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addNewItemInPortfolio.pending, (state) => {
      state.status = 'LOADING'
    })
    builder.addCase(addNewItemInPortfolio.fulfilled, (state, action) => {
      state.status = 'SUCCESS'
    })
    builder.addCase(addNewItemInPortfolio.rejected, (state) => {
      state.status = 'ERROR'
    })

    builder.addCase(createPortfolio.pending, (state) => {
      state.status = 'LOADING'
    })
    builder.addCase(createPortfolio.fulfilled, (state, action) => {
      state.havePortfolio = true

      state.status = 'SUCCESS'
    })
    builder.addCase(createPortfolio.rejected, (state) => {
      state.status = 'ERROR'
    })

    builder.addCase(getPortfolio.pending, (state) => {
      state.status = 'LOADING'
    })
    builder.addCase(getPortfolio.fulfilled, (state, action) => {
      state.havePortfolio = true
      state.status = 'SUCCESS'
      state.portfolioInfo = action.payload
      state.newPriceForItems = action.payload['itemPrice']
      state.statistics = action.payload.portfolio['statistics']
      const price = state.newPriceForItems
      const list = action.payload.portfolio['cryptoItem']

      state.portfolioCryptoList = action.payload.portfolio['cryptoItem']
      state.totalBalans = list.reduce((sum: number, el: CryptoItems) => {
        return Number(price[el.marker]['USD']) * el.amount + sum
      }, 0)

      function sortYear(a: any, b: any) {
        if (
          price[a.marker]['USD'] * a.amount >
          price[b.marker]['USD'] * b.amount
        )
          return -1
        if (
          price[a.marker]['USD'] * a.amount <
          price[b.marker]['USD'] * b.amount
        )
          return 1

        return 0
      }

      list.sort(sortYear)

      state.color = list.map((el: any) => el.color)
      state.priceData = list.map(
        (el: any) => price[el.marker]['USD'] * el.amount,
      )
    })
    builder.addCase(getPortfolio.rejected, (state) => {
      state.status = 'ERROR'
    })

    builder.addCase(deleteCryptoItem.pending, (state) => {
      state.status = 'LOADING'
    })
    builder.addCase(deleteCryptoItem.fulfilled, (state, action) => {
      state.status = 'SUCCESS'

      state.portfolioCryptoList = state.portfolioCryptoList.filter(
        (el: any) => el.id !== action.payload,
      )
      state.totalBalans = state.portfolioCryptoList.reduce(
        (sum: number, el: CryptoItems) => {
          return (
            Number(state.newPriceForItems[el.marker]['USD']) * el.amount + sum
          )
        },
        0,
      )
      function sortYear(a: any, b: any) {
        if (
          state.newPriceForItems[a.marker]['USD'] * a.amount >
          state.newPriceForItems[b.marker]['USD'] * b.amount
        )
          return -1
        if (
          state.newPriceForItems[a.marker]['USD'] * a.amount <
          state.newPriceForItems[b.marker]['USD'] * b.amount
        )
          return 1

        return 0
      }
      state.portfolioCryptoList.sort(sortYear)

      state.color = state.portfolioCryptoList.map((el: any) => el.color)
      state.priceData = state.portfolioCryptoList.map(
        (el: any) => state.newPriceForItems[el.marker]['USD'] * el.amount,
      )
    })
    builder.addCase(deleteCryptoItem.rejected, (state) => {
      state.status = 'ERROR'
    })
  },
})

export const { setModalWindow, chengeStatusPortfolio } =
  cryptoPortfolioSlice.actions

export default cryptoPortfolioSlice.reducer
