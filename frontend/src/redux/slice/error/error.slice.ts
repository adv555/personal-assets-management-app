import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IError {
  statusCode: number | string | undefined
  message: string
}

const initialState: IError = {
  statusCode: '',
  message: '',
}

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    errorOccurred: (_, action: PayloadAction<IError>) => ({
      statusCode: action.payload.statusCode,
      message: action.payload.message,
    }),
    resetError: () => ({ ...initialState }),
  },
})

export const { errorOccurred, resetError } = errorSlice.actions

export default errorSlice.reducer
