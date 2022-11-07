import { createSlice } from '@reduxjs/toolkit'

const initialState = false

const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    startLoading: () => true,
    stopLoading: () => false,
  },
})

export const { startLoading, stopLoading } = loaderSlice.actions

export default loaderSlice.reducer
