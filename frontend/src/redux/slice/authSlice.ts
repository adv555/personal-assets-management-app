import { createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import {
  authWithGoogle,
  checkAuth,
  fetchLogin,
  Logout,
  Registration,
  verifyCodeAuth,
} from '../thunk/authThunk'

interface typeInfo {
  user: any
  status: string
  isAuth: boolean
  isVerify: boolean
  sendAuthMessage: boolean
  hasCryptoPortfolio: boolean
  messageError: string
  messageSuccess: string
}
const initialState: typeInfo = {
  user: {},
  status: 'INIT',
  isAuth: false,
  isVerify: false,
  sendAuthMessage: false,
  hasCryptoPortfolio: false,
  messageError: '',
  messageSuccess: 'Successful !',
}
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    toggleSendAuthMessage(state) {
      state.sendAuthMessage = true
    },
    changeStatusCryptoPosrtfolio(state) {
      state.hasCryptoPortfolio = true
    },
    changeStatusCryptoPosrtfolioOnFalse(state) {
      state.hasCryptoPortfolio = false
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLogin.pending, (state) => {
      state.status = 'LOADING'
    })
    builder.addCase(fetchLogin.fulfilled, (state, action) => {
      state.status = 'SUCCESS'
      const statusCode = action.payload?.status

      if (statusCode === 201) {
        state.isVerify = true
      }
    })
    builder.addCase(fetchLogin.rejected, (state, action) => {
      state.status = 'ERROR'
      state.messageError = String(action.payload)
    })

    builder.addCase(Registration.pending, (state) => {
      state.status = 'LOADING'
    })
    builder.addCase(Registration.fulfilled, (state, action) => {
      state.status = 'SUCCESS'
    })
    builder.addCase(Registration.rejected, (state, action) => {
      state.status = 'ERROR'
      state.messageError = String(action.payload)
    })

    builder.addCase(Logout.pending, (state) => {
      state.status = 'LOADING'
    })
    builder.addCase(Logout.fulfilled, (state) => {
      state.status = 'SUCCESS'
      state.isAuth = false
      state.isVerify = false
      state.sendAuthMessage = false
      state.hasCryptoPortfolio = false
      state.user = {}
    })
    builder.addCase(Logout.rejected, (state) => {
      state.status = 'ERROR'
    })

    builder.addCase(checkAuth.pending, (state) => {
      state.status = 'LOADING'
    })
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.status = 'SUCCESS'

      if (action.payload['status'] === 200) {
        state.user = action.payload['data'].user
        localStorage.setItem(
          'token',
          action.payload['data'].tokens.access_token,
        )
        state.hasCryptoPortfolio =
          action.payload['data']['user']?.['hasCryptoWallet']
        state.isAuth = true
      }
      if (action.payload['status'] > 201) {
        state.user = {}
        localStorage.removeItem('token')
        state.isAuth = false
      }
    })
    builder.addCase(checkAuth.rejected, (state) => {
      state.status = 'ERROR'
      state.isAuth = false
    })

    builder.addCase(authWithGoogle.pending, (state) => {
      state.status = 'LOADING'
    })
    builder.addCase(authWithGoogle.fulfilled, (state, action) => {
      state.status = 'SUCCESS'
      state.user = action.payload['user']
      state.hasCryptoPortfolio = action.payload['user']?.['hasCryptoWallet']
      localStorage.setItem('token', action.payload.tokens.access_token)
      state.isAuth = true
    })
    builder.addCase(authWithGoogle.rejected, (state, action) => {
      state.status = 'ERROR'
      state.isAuth = false
      state.messageError = String(action.payload)
    })
    builder.addCase(verifyCodeAuth.pending, (state) => {
      state.status = 'LOADING'
    })
    builder.addCase(verifyCodeAuth.fulfilled, (state, action) => {
      state.status = 'SUCCESS'
      const statusCode = action.payload['status']

      if (statusCode !== 201) {
        state.sendAuthMessage = true
      }
      const userData = action.payload['data']

      state.hasCryptoPortfolio =
        action.payload['data']['user']['hasCryptoWallet']

      state.user = userData.user

      localStorage.setItem('token', userData.tokens.access_token)
      sessionStorage.clear()
      state.isAuth = true
      state.isVerify = false
    })
    builder.addCase(verifyCodeAuth.rejected, (state, action) => {
      state.sendAuthMessage = true
      state.status = 'ERROR'
      state.isAuth = false
      state.messageError = String(action.payload)
    })
  },
})

export const {
  toggleSendAuthMessage,
  changeStatusCryptoPosrtfolio,
  changeStatusCryptoPosrtfolioOnFalse,
} = authSlice.actions

export default authSlice.reducer
