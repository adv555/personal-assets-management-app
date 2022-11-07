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
import { Currencies } from 'common/enums/currency.enum'
import { IncomeCategories } from 'common/enums/incomesCategories.enum'
import { LoadingStatus } from 'common/enums/loading-status'
import { IWallet } from './walletsSlice'
import { ICreateTransactionParams } from 'components/wallets/transactions/CreateTransactionForm'
import {
  IDeleteTransaction,
  IUpdateTransactionParams,
} from 'components/wallets/transactions/UpdateTransactionForm'

const incomesLimit = 5

export interface IIncome {
  id: number
  createdAt: Date
  updatedAt: Date
  income_name: string
  category_name: IncomeCategories
  income_sum: number
  is_transaction: boolean
}

interface ICreateIncomeDto {
  income_name: string
  income_sum: number
  category_name: IncomeCategories
}

interface IUpdateIncomeDto {
  income_name: string
  income_sum: number
  category_name: IncomeCategories
  createdAt: Date
}

export interface IGetWalletIncomes extends IWallet {
  income: IIncome[]
  income_count: number
}

interface IGetIncomesParams {
  walletId: number
  limit: number
}

export interface IGetMoreIncomesParams {
  walletId: number
  limit: number
  offset: number
}

interface IIncomeState {
  incomes: IIncome[]
  loading: LoadingStatus
  errorMessage: string | null
  successMessage: string | null
  income_count: number
  currency: Currencies
  limit: number
  offset: number
  currentIncome: IIncome | null
}

const initialState: IIncomeState = {
  incomes: [],
  loading: LoadingStatus.SUCCESS,
  errorMessage: null,
  successMessage: null,
  income_count: 0,
  currency: Currencies.UAH,
  limit: incomesLimit,
  offset: incomesLimit,
  currentIncome: null,
}

export const fetchIncomes = createAsyncThunk<
  IGetWalletIncomes,
  IGetIncomesParams,
  { rejectValue: string }
>('incomes/fetchIncomes', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get(
      `/income/wallet/${params.walletId}?limit=${params.limit}`,
    )

    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
})

export const fetchMoreIncomes = createAsyncThunk<
  IGetWalletIncomes,
  IGetMoreIncomesParams,
  { rejectValue: string }
>('incomes/fetchMoreIncomes', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get(
      `/income/wallet/${params.walletId}?limit=${params.limit}&offset=${params.offset}`,
    )

    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
})

export const addNewIncome = createAsyncThunk<
  IGetWalletIncomes,
  ICreateTransactionParams,
  { rejectValue: string }
>('incomes/addIncome', async (params, { rejectWithValue }) => {
  try {
    const newIncome: ICreateIncomeDto = {
      income_name: params.data.name,
      income_sum: params.data.sum,
      category_name: params.data.categoryName as IncomeCategories,
    }

    await api.post(`/income/wallet/${params.walletId}`, newIncome)

    const { data } = await api.get(
      `/income/wallet/${params.walletId}?limit=${params.limit}`,
    )

    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
})

export const updateIncome = createAsyncThunk<
  IGetWalletIncomes,
  IUpdateTransactionParams,
  { rejectValue: string }
>('incomes/updateIncome', async (params, { rejectWithValue }) => {
  try {
    const updated: IUpdateIncomeDto = {
      income_name: params.data.name,
      income_sum: params.data.sum,
      category_name: params.data.categoryName as IncomeCategories,
      createdAt: params.data.createdAt,
    }

    await api.patch(`/income/${params.transactionId}`, updated)

    const { data } = await api.get(
      `/income/wallet/${params.walletId}?limit=${params.limit}`,
    )

    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
})

export const deleteIncome = createAsyncThunk<
  IGetWalletIncomes,
  IDeleteTransaction,
  { rejectValue: string }
>('incomes/deleteIncome', async (params, { rejectWithValue }) => {
  try {
    await api.delete(`/income/${params.transactionId}`)

    const { data } = await api.get(
      `/income/wallet/${params.walletId}?limit=${params.limit}`,
    )

    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
})

const isAllLoading = isPending(
  fetchIncomes,
  fetchMoreIncomes,
  addNewIncome,
  updateIncome,
  deleteIncome,
)

const isAllSuccess = isFulfilled(
  fetchIncomes,
  fetchMoreIncomes,
  addNewIncome,
  updateIncome,
  deleteIncome,
)

const isAllError = isRejectedWithValue(
  fetchIncomes,
  fetchMoreIncomes,
  addNewIncome,
  updateIncome,
  deleteIncome,
)

const incomeSlice = createSlice({
  name: 'incomes',
  initialState,
  reducers: {
    setOffset(state, action: PayloadAction<number>) {
      state.offset = action.payload
    },
    setCurrentIncome(state, action: PayloadAction<IIncome>) {
      state.currentIncome = action.payload
    },
    setIncomeSuccess(state, action: PayloadAction<string | null>) {
      state.successMessage = action.payload
    },
    setIncomeError(state, action: PayloadAction<string | null>) {
      state.errorMessage = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncomes.fulfilled, (state, action) => {
        state.incomes = action.payload.income
        state.income_count = action.payload.income_count
        state.currency = action.payload.currency
        state.offset = incomesLimit
      })
      .addCase(fetchMoreIncomes.fulfilled, (state, action) => {
        state.incomes = [...state.incomes, ...action.payload.income]
      })
      .addCase(addNewIncome.fulfilled, (state, action) => {
        state.incomes = action.payload.income
        state.income_count = action.payload.income_count
        state.successMessage = 'Added new income'
        state.offset = incomesLimit
      })
      .addCase(updateIncome.fulfilled, (state, action) => {
        state.incomes = action.payload.income
        state.income_count = action.payload.income_count
        state.successMessage = 'Update income successfully'
        state.offset = incomesLimit
      })
      .addCase(deleteIncome.fulfilled, (state, action) => {
        state.incomes = action.payload.income
        state.income_count = action.payload.income_count
        state.successMessage = 'Delete income successfully'
        state.offset = incomesLimit
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

export const { setOffset, setCurrentIncome, setIncomeSuccess, setIncomeError } =
  incomeSlice.actions

export default incomeSlice.reducer
