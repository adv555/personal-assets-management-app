import { createAsyncThunk } from '@reduxjs/toolkit'
import axios, { AxiosError } from 'axios'
import api from 'axios/axios'
import { errorOccurred, resetError } from 'redux/slice/error/error.slice'
import { startLoading, stopLoading } from 'redux/slice/loader/loader.slice'
import { resetSuccess, successAction } from 'redux/slice/success/success.slice'
import { removeUserSuccess } from 'redux/slice/userProfile/userProfile.slice'
import { AppDispatch } from 'redux/store'

export const getTenCoins = createAsyncThunk(
  'users/fetchGetTenCoins',
  async (props: any): Promise<any> => {
    const { data } = await axios.get(
      `https://min-api.cryptocompare.com/data/top/totalvolfull?limit=100&tsym=${props}`,
    )

    return data
  },
)

export const getOneCoin = createAsyncThunk(
  'user/fetchOneCoin',
  async ({ marker, currency }: any) => {
    const { data } = await axios.get(
      `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${marker}&tsyms=${currency}`,
    )

    return { data, marker, currency }
  },
)

export const getStatisticsOneCoin = createAsyncThunk(
  'user/getStatisticsOneCoin',
  async ({ marker, currency, limitDay }: any) => {
    const { data } = await axios.get(
      `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${marker}&tsym=${currency}&limit=${limitDay}`,
    )

    return data
  },
)

export const createPortfolio = createAsyncThunk(
  'user/addPortfolio',
  async (param) => {
    await api.get('cryptoPortfolio/create')
  },
)

export const addNewItemInPortfolio = createAsyncThunk(
  'user/addNewItemInPortfolio',
  async (cryptoItemInModal: any) => {
    const { data } = await api.post('crypto/create', cryptoItemInModal)

    return data
  },
)

export const getPortfolio = createAsyncThunk(
  'user/getPortfolio',
  async (param) => {
    const { data } = await api.get('cryptoPortfolio/myPortfolio')

    return data
  },
)

export const deleteCryptoItem = createAsyncThunk(
  'user/deleteCryptoItem',
  async (idItem: number) => {
    console.log(idItem)
    const { data } = await api.delete(`crypto/${Number(idItem)}`)

    return idItem
  },
)

// export const createNewCryptoItem = createAsyncThunk(
//   'user/createNewCryptoItem',
//   async (param) => {
//     const { data } = await api.post('crypto/create',param)

//     return data
//   },
// )
