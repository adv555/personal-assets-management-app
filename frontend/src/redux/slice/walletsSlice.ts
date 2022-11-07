import { LoadingStatus } from './../../common/enums/loading-status'
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  isPending,
  isFulfilled,
  isRejectedWithValue,
} from '@reduxjs/toolkit'
import api from 'axios/axios'
import { Currencies } from 'common/enums/currency.enum'
import { AxiosError } from 'axios'
import { WalletStatus } from 'common/enums/walletStatus.enum'

export interface IWallet {
  id: number
  createdAt: Date
  updatedAt: Date
  wallet_name: string
  status: WalletStatus
  total_balance: number
  currency: Currencies
}

export interface IWalletDto {
  wallet_name: string
  currency: Currencies
}

interface IUpdateWallet {
  data: {
    wallet_name: string
  }
  walletId: number
}

interface IWalletState {
  wallets: IWallet[]
  loading: LoadingStatus
  errorMessage: string | null
  activeWallet: IWallet | null
  successMessage: string | null
  firstWalletIndex: number
  lastWalletIndex: number
}

const initialState: IWalletState = {
  wallets: [],
  loading: LoadingStatus.SUCCESS,
  errorMessage: null,
  activeWallet: null,
  successMessage: null,
  firstWalletIndex: 0,
  lastWalletIndex: 2,
}

export const fetchWallets = createAsyncThunk<
  IWallet[],
  unknown,
  { rejectValue: string }
>('wallets/fetchWallets', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/wallets')

    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
})

export const addNewWallets = createAsyncThunk<
  IWallet,
  IWalletDto,
  { rejectValue: string }
>('wallets/addWallet', async (newWallet, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/wallets', newWallet)

    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
})

export const updateWallet = createAsyncThunk<
  IWallet,
  IUpdateWallet,
  { rejectValue: string }
>('wallets/updateWallet', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/wallets/${params.walletId}`, params.data)

    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
})

export const deleteWallet = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>('wallets/deleteWallet', async (walletId, { rejectWithValue }) => {
  try {
    await api.delete(`/wallets/${walletId}`)

    return walletId as any
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
})

const isAllLoading = isPending(
  fetchWallets,
  addNewWallets,
  updateWallet,
  deleteWallet,
)

const isAllSuccess = isFulfilled(
  fetchWallets,
  addNewWallets,
  updateWallet,
  deleteWallet,
)

const isAllError = isRejectedWithValue(
  fetchWallets,
  addNewWallets,
  updateWallet,
  deleteWallet,
)

const walletsSlice = createSlice({
  name: 'wallets',
  initialState,
  reducers: {
    setActiveWallet(state, action: PayloadAction<IWallet>) {
      state.activeWallet = action.payload
    },
    setWalletSuccess(state, action: PayloadAction<string | null>) {
      state.successMessage = action.payload
    },
    setWalletError(state, action: PayloadAction<string | null>) {
      state.errorMessage = action.payload
    },
    setFirstIndex(state, action: PayloadAction<number>) {
      state.firstWalletIndex = action.payload
    },
    setLastIndex(state, action: PayloadAction<number>) {
      state.lastWalletIndex = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallets.fulfilled, (state, action) => {
        if (action.payload.length > 0) {
          state.wallets = action.payload.sort((a, b) => (a.id > b.id ? 1 : -1))
        }
        if (action.payload.length > 0 && state.activeWallet === null) {
          state.activeWallet = action.payload[0]
        }
      })
      .addCase(addNewWallets.fulfilled, (state, action) => {
        state.wallets.push(action.payload)
        state.activeWallet = action.payload
        state.successMessage = `Wallet ${action.payload.wallet_name} created`
        state.firstWalletIndex = state.wallets.length - 3
        state.lastWalletIndex = state.wallets.length - 1
      })
      .addCase(updateWallet.fulfilled, (state, action) => {
        state.wallets = state.wallets.map((wallet) => {
          if (wallet.id === action.payload.id) {
            state.activeWallet = action.payload

            return action.payload
          }

          return wallet
        })

        state.successMessage = `Wallet updated`
      })
      .addCase(deleteWallet.fulfilled, (state, action) => {
        state.wallets = state.wallets.filter(
          (wallet) => wallet.id !== action.payload,
        )
        state.wallets.length > 0
          ? (state.activeWallet = state.wallets[0])
          : (state.activeWallet = null)

        state.successMessage = `Wallet deleted`
        state.firstWalletIndex = 0
        state.lastWalletIndex = 2
      })
      .addMatcher(isAllSuccess, (state) => {
        state.loading = LoadingStatus.SUCCESS
        state.errorMessage = null
      })
      .addMatcher(isAllLoading, (state) => {
        state.loading = LoadingStatus.LOADING
        state.successMessage = null
        state.errorMessage = null
      })
      .addMatcher(isAllError, (state, action: PayloadAction<string>) => {
        state.errorMessage = action.payload
        state.loading = LoadingStatus.ERROR
      })
  },
})

export const {
  setActiveWallet,
  setFirstIndex,
  setLastIndex,
  setWalletSuccess,
  setWalletError,
} = walletsSlice.actions

export default walletsSlice.reducer
