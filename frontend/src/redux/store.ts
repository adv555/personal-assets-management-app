import { configureStore } from '@reduxjs/toolkit'
import cryptoWidgetSlice from './slice/cryptoWidgetSlice'
import cryptoPortfolioSlice from './slice/cryptoPortfolioSlice'
import {
  authSlice,
  conversationsSlice,
  errorSlice,
  exchangeSlice,
  loaderSlice,
  messagesSlice,
  successSlice,
  userProfileSlice,
  walletsSlice,
  incomeSlice,
  costsSlice,
  moneyBoxesSlice,
  widgetsSlice,
} from './slice'
import invoiceSlice from './slice/invoiceServices/invoice.slice'
import paginationSlice from './slice/pagination/pagination.slice'
import refreshPasswordSlice from './slice/refreshPasswordSlice'
import todoSlice from './slice/todo/todo.slice'
import walletLimitSlice from './slice/walletLimitSlice'

export const store = configureStore({
  reducer: {
    authSlice,
    cryptoWidgetSlice,
    cryptoPortfolioSlice,
    refreshPasswordSlice,
    userProfile: userProfileSlice,
    invoices: invoiceSlice,
    pagination: paginationSlice,
    success: successSlice,
    error: errorSlice,
    loader: loaderSlice,
    exchange: exchangeSlice,
    wallets: walletsSlice,
    incomes: incomeSlice,
    costs: costsSlice,
    messages: messagesSlice,
    conversations: conversationsSlice,
    todo: todoSlice,
    widgets: widgetsSlice,
    walletLimit: walletLimitSlice,
    moneyBoxes: moneyBoxesSlice,
  },
})
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
