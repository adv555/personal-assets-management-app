import { stat } from 'fs'
import { createSlice } from '@reduxjs/toolkit'
import {
  checkEmailAndSendCode,
  checkEmailAndSendCodeAgain,
  refreshPassword,
  verifyCode,
} from '../thunk/authThunk'

export interface CounterState {
  value: number
  statusRefreshSlice: string
  statusCode: number | null
  permission: boolean
  codeWillBySend: boolean
  messageErrorRefreshSlice: string
  messageSuccess: string
}

const initialState: CounterState = {
  statusRefreshSlice: 'INIT',
  statusCode: 0,
  permission: false,
  codeWillBySend: false,
  value: 0,
  messageErrorRefreshSlice: '',
  messageSuccess: '',
}
const refreshPasswordSlice = createSlice({
  name: 'authRefresh',
  initialState,
  reducers: {
    getPermission(state) {
      state.permission = true
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkEmailAndSendCode.pending, (state) => {
      state.statusRefreshSlice = 'LOADING'
    })
    builder.addCase(checkEmailAndSendCode.fulfilled, (state, action) => {
      console.log(action.payload['status'])
      state.statusCode = action.payload['status']
      state.statusRefreshSlice = 'SUCCESS'
      state.codeWillBySend = true
      const { email } = action.payload['params']

      if (state.statusCode == 201) {
        sessionStorage.setItem('email', email)
      }
    })
    builder.addCase(checkEmailAndSendCode.rejected, (state, action) => {
      state.statusRefreshSlice = 'ERROR'
      state.messageErrorRefreshSlice = String(action.payload)
    })
    builder.addCase(verifyCode.pending, (state) => {
      state.statusRefreshSlice = 'LOADING'
    })
    builder.addCase(verifyCode.fulfilled, (state, action) => {
      const { statusCode } = action.payload

      if (statusCode === 200) {
        state.permission = true
        state.codeWillBySend = false
      }
      state.statusRefreshSlice = 'SUCCESS'
    })
    builder.addCase(verifyCode.rejected, (state, action) => {
      state.statusRefreshSlice = 'ERROR'
      state.messageErrorRefreshSlice = String(action.payload)
    })
    builder.addCase(refreshPassword.pending, (state) => {
      state.statusRefreshSlice = 'LOADING'
    })
    builder.addCase(refreshPassword.fulfilled, (state, action) => {
      const statusCode2 = action.payload

      console.log(action.payload)
      if (statusCode2 === 202) {
        state.statusCode = statusCode2
      }
      state.statusRefreshSlice = 'SUCCESS'
    })
    builder.addCase(refreshPassword.rejected, (state, action) => {
      state.statusRefreshSlice = 'ERROR'
      state.messageErrorRefreshSlice = String(action.payload)
    })
    builder.addCase(checkEmailAndSendCodeAgain.pending, (state) => {
      state.statusRefreshSlice = 'LOADING'
    })
    builder.addCase(checkEmailAndSendCodeAgain.fulfilled, (state, action) => {
      const { status } = action.payload

      if (status > 202) {
        state.statusCode = status
      }
      state.statusRefreshSlice = 'SUCCESS'
    })
    builder.addCase(checkEmailAndSendCodeAgain.rejected, (state, action) => {
      state.statusRefreshSlice = 'ERROR'
      state.messageErrorRefreshSlice = String(action.payload)
    })
  },
})

export const { getPermission } = refreshPasswordSlice.actions

export default refreshPasswordSlice.reducer
