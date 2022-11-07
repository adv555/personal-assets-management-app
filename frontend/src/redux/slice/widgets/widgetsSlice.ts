import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejectedWithValue,
  PayloadAction,
} from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { LoadingStatus } from 'common/enums/loading-status'
import {
  IUserWidget,
  IUserWidgetDto,
  IWidgetsState,
} from 'widgets/common/interfaces/widgets.interface'
import api from 'axios/axios'
import { WidgetsEnum } from '../../../widgets/common/enum/widgets.enum'

export const fetchAllUsersWidgets = createAsyncThunk<
  IUserWidget[],
  undefined,
  { rejectValue: string }
>('widgets/fetchAllUsersWidgets', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get<IUserWidget[]>('/widgets')

    return data
  } catch (error) {
    return error instanceof AxiosError
      ? rejectWithValue(error.response?.data?.message as string)
      : rejectWithValue('')
  }
})

export const addUserWidget = createAsyncThunk<
  IUserWidget,
  IUserWidgetDto,
  { rejectValue: string }
>('widgets/addUserWidget', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.post<IUserWidget>('/widgets', params)

    return data
  } catch (error) {
    return error instanceof AxiosError
      ? rejectWithValue(error.response?.data?.message as string)
      : rejectWithValue('')
  }
})

export const removeUserWidget = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('widgets/removeUserWidget', async (widgetKey, { rejectWithValue }) => {
  try {
    await api.delete(`/widgets/${widgetKey}`)

    return widgetKey
  } catch (error) {
    return error instanceof AxiosError
      ? rejectWithValue(error.response?.data?.message as string)
      : rejectWithValue('')
  }
})

const isAllLoading = isPending(
  fetchAllUsersWidgets,
  addUserWidget,
  removeUserWidget,
)

const isAllSuccess = isFulfilled(
  fetchAllUsersWidgets,
  addUserWidget,
  removeUserWidget,
)

const isAllError = isRejectedWithValue(
  fetchAllUsersWidgets,
  addUserWidget,
  removeUserWidget,
)

const initialState: IWidgetsState = {
  userWidgets: [],
  status: LoadingStatus.SUCCESS,
}

const widgetsSlice = createSlice({
  name: 'widgets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsersWidgets.fulfilled, (state, action) => {
        state.userWidgets = action.payload
      })
      .addCase(addUserWidget.fulfilled, (state, action) => {
        state.userWidgets.push(action.payload)
      })
      .addCase(removeUserWidget.fulfilled, (state, action) => {
        state.userWidgets = state.userWidgets.filter(
          (widget) => widget.key !== action.payload,
        )
      })
      .addMatcher(isAllSuccess, (state) => {
        state.status = LoadingStatus.SUCCESS
      })
      .addMatcher(isAllLoading, (state) => {
        state.status = LoadingStatus.LOADING
      })
      .addMatcher(isAllError, (state) => {
        state.status = LoadingStatus.ERROR
      })
  },
})

export const {} = widgetsSlice.actions

export default widgetsSlice.reducer
