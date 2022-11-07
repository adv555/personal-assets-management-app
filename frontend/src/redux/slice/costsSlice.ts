import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejectedWithValue,
  PayloadAction,
} from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import api from 'axios/axios'
import { CostsCategories } from 'common/enums/costsCategories.enum'
import { Currencies } from 'common/enums/currency.enum'
import { LoadingStatus } from 'common/enums/loading-status'
import { IWallet } from './walletsSlice'
import { ICreateTransactionParams } from 'components/wallets/transactions/CreateTransactionForm'
import {
  IDeleteTransaction,
  IUpdateTransactionParams,
} from 'components/wallets/transactions/UpdateTransactionForm'

const costsLimit = 5

export interface ICost {
  id: number
  createdAt: Date
  updatedAt: Date
  category_name: CostsCategories
  cost_name: string
  cost_sum: number
  is_transaction: boolean
}

interface ICreateCostDto {
  cost_name: string
  cost_sum: number
  category_name: CostsCategories
}

interface IUpdateCostDto {
  cost_name: string
  cost_sum: number
  category_name: CostsCategories
  createdAt: Date
}

export interface IGetWalletCosts extends IWallet {
  costs: ICost[]
  costs_count: number
}

interface IGetCostsParams {
  walletId: number
  limit: number
}

export interface IGetMoreCostsParams {
  walletId: number
  limit: number
  offset: number
}

interface ICostsState {
  costs: ICost[]
  loading: LoadingStatus
  errorMessage: string | null
  successMessage: string | null
  costs_count: number
  currency: Currencies
  limit: number
  offset: number
  currentCost: ICost | null
}

const initialState: ICostsState = {
  costs: [],
  loading: LoadingStatus.SUCCESS,
  errorMessage: null,
  successMessage: null,
  costs_count: 0,
  currency: Currencies.UAH,
  limit: costsLimit,
  offset: costsLimit,
  currentCost: null,
}

export const fetchCosts = createAsyncThunk<
  IGetWalletCosts,
  IGetCostsParams,
  { rejectValue: string }
>('costs/fetchCosts', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get(
      `/costs/wallet/${params.walletId}?limit=${params.limit}`,
    )

    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
})

export const fetchMoreCosts = createAsyncThunk<
  IGetWalletCosts,
  IGetMoreCostsParams,
  { rejectValue: string }
>('costs/fetchMoreCosts', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get(
      `/costs/wallet/${params.walletId}?limit=${params.limit}&offset=${params.offset}`,
    )

    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
})

export const addNewCost = createAsyncThunk<
  IGetWalletCosts,
  ICreateTransactionParams,
  { rejectValue: string }
>('costs/addCost', async (params, { rejectWithValue }) => {
  try {
    const newCost: ICreateCostDto = {
      cost_name: params.data.name,
      cost_sum: params.data.sum,
      category_name: params.data.categoryName as CostsCategories,
    }

    await api.post(`/costs/wallet/${params.walletId}`, newCost)

    const { data } = await api.get(
      `/costs/wallet/${params.walletId}?limit=${params.limit}`,
    )

    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
})

export const updateCost = createAsyncThunk<
  IGetWalletCosts,
  IUpdateTransactionParams,
  { rejectValue: string }
>('costs/updateCost', async (params, { rejectWithValue }) => {
  try {
    const updatedCost: IUpdateCostDto = {
      cost_name: params.data.name,
      cost_sum: params.data.sum,
      category_name: params.data.categoryName as CostsCategories,
      createdAt: params.data.createdAt,
    }

    await api.patch(`/costs/${params.transactionId}`, updatedCost)

    const { data } = await api.get(
      `/costs/wallet/${params.walletId}?limit=${params.limit}`,
    )

    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
})

export const deleteCost = createAsyncThunk<
  IGetWalletCosts,
  IDeleteTransaction,
  { rejectValue: string }
>('costs/deleteCost', async (parans, { rejectWithValue }) => {
  try {
    await api.delete(`/costs/${parans.transactionId}`)

    const { data } = await api.get(`/costs/wallet/${parans.walletId}?limit=5`)

    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
})

const isAllLoading = isPending(
  fetchCosts,
  fetchMoreCosts,
  addNewCost,
  updateCost,
  deleteCost,
)

const isAllSuccess = isFulfilled(
  fetchCosts,
  fetchMoreCosts,
  addNewCost,
  updateCost,
  deleteCost,
)

const isAllError = isRejectedWithValue(
  fetchCosts,
  fetchMoreCosts,
  addNewCost,
  updateCost,
  deleteCost,
)

const costSlice = createSlice({
  name: 'costs',
  initialState,
  reducers: {
    setOffset(state, action: PayloadAction<number>) {
      state.offset = action.payload
    },
    setCurrentCost(state, action: PayloadAction<ICost>) {
      state.currentCost = action.payload
    },
    setCostSuccess(state, action: PayloadAction<string | null>) {
      state.successMessage = action.payload
    },
    setCostError(state, action: PayloadAction<string | null>) {
      state.errorMessage = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCosts.fulfilled, (state, action) => {
        state.costs = action.payload.costs
        state.costs_count = action.payload.costs_count
        state.currency = action.payload.currency
        state.offset = costsLimit
      })
      .addCase(fetchMoreCosts.fulfilled, (state, action) => {
        state.costs = [...state.costs, ...action.payload.costs]
      })
      .addCase(addNewCost.fulfilled, (state, action) => {
        state.costs = action.payload.costs
        state.costs_count = action.payload.costs_count
        state.successMessage = 'Added new cost'
        state.offset = costsLimit
      })
      .addCase(updateCost.fulfilled, (state, action) => {
        state.costs = action.payload.costs
        state.costs_count = action.payload.costs_count
        state.successMessage = 'Update cost successfully'
        state.offset = costsLimit
      })
      .addCase(deleteCost.fulfilled, (state, action) => {
        state.costs = action.payload.costs
        state.costs_count = action.payload.costs_count
        state.successMessage = 'Delete cost successfully'
        state.offset = costsLimit
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

export const { setOffset, setCurrentCost, setCostSuccess, setCostError } =
  costSlice.actions

export default costSlice.reducer
