import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IWallet } from './walletsSlice'

export interface IWalletLimit {
  id: number
  createdAt: string
  updatedAt: string
  wallet: IWallet
  wallet_limit: number
  wallet_duration: number
}

const initialState: { walletLimits: IWalletLimit[] } = { walletLimits: [] }

export const walletLimitSlice = createSlice({
  name: 'walletLimits',
  initialState,
  reducers: {
    initialWalletLimits: (state, action) => ({
      walletLimits: action.payload,
    }),
  },
})

export const { initialWalletLimits } = walletLimitSlice.actions

export default walletLimitSlice.reducer
