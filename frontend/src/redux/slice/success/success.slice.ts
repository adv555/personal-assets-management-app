import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  message: '',
}

const successSlice = createSlice({
  name: 'success',
  initialState,
  reducers: {
    successAction: (_, action: PayloadAction<{ message: string }>) => ({
      message: action.payload.message,
    }),
    resetSuccess: () => ({ ...initialState }),
  },
})

export const { successAction, resetSuccess } = successSlice.actions

export default successSlice.reducer
