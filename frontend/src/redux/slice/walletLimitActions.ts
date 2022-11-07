import { AxiosError, AxiosRequestConfig } from 'axios'
import api from 'axios/axios'
import { AppDispatch } from 'redux/store'
import { errorOccurred, resetError } from './error/error.slice'
import { startLoading, stopLoading } from './loader/loader.slice'
import { resetSuccess, successAction } from './success/success.slice'
import { initialWalletLimits } from './walletLimitSlice'
import { notifyError, notifySuccess } from 'components/common/notifications'

const getAllWalletLimits = () => {
  return api.get('/walletLimits')
}

const createWalletLimit = (walletId: number) => {
  const defaultData = {
    wallet_limit: 1000,
    wallet_duration: 30,
  }

  return api.post('/walletLimits/' + walletId, defaultData)
}

const updateWalletLimit = async (walletLimitId: number, walletLimit: any) => {
  const wallet_limit = walletLimit.wallet_limit
  const wallet_duration = walletLimit.wallet_duration

  return api.patch('/walletLimits/' + walletLimitId, {
    wallet_limit: wallet_limit,
    wallet_duration: wallet_duration,
  })
}

const removeWalletLimit = (walletLimitId: number) => {
  return api.delete('/walletLimits/' + walletLimitId)
}

export const fetchUpdateWalletLimit = (
  walletLimitId: number,
  walletLimit: any,
) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(resetError())
      dispatch(resetSuccess())
      dispatch(startLoading())

      await updateWalletLimit(walletLimitId, walletLimit)
      const response = await getAllWalletLimits()

      dispatch(initialWalletLimits(response.data.tmp))
      dispatch(successAction({ message: 'Wallet limit updated successfully' }))
    } catch (e) {
      console.log(e)
      const axiosErr = e as AxiosError
      const status = axiosErr.response?.status
      const message = axiosErr.message

      dispatch(errorOccurred({ statusCode: status, message: message }))
      // dispatch(notifyError(message))
    } finally {
      dispatch(stopLoading())
    }
  }
}

export const fetchCreateWalletLimit = (walletId: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(resetError())
      dispatch(resetSuccess())
      dispatch(startLoading())

      await createWalletLimit(walletId)
      const response = await getAllWalletLimits()

      dispatch(initialWalletLimits(response.data.tmp))
      dispatch(successAction({ message: 'Wallet limit created successfully' }))
    } catch (e) {
      const axiosErr = e as AxiosError
      const status = axiosErr.response?.status
      const message = axiosErr.message

      dispatch(errorOccurred({ statusCode: status, message: message }))
    } finally {
      dispatch(stopLoading())
    }
  }
}

export const fetchAllWalletLimits = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(resetError())
      dispatch(startLoading())
      const response = await getAllWalletLimits()

      dispatch(initialWalletLimits(response.data.tmp))
    } catch (e) {
      const axiosErr = e as AxiosError
      const status = axiosErr.response?.status
      const message = axiosErr.message

      dispatch(errorOccurred({ statusCode: status, message: message }))
    } finally {
      dispatch(stopLoading())
    }
  }
}

export const fetchRemoveWalletLimit = (walletLimitId: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(resetError())
      dispatch(startLoading())

      await removeWalletLimit(walletLimitId)
      const response = await getAllWalletLimits()

      dispatch(initialWalletLimits(response.data.tmp))
      dispatch(successAction({ message: 'Wallet limit removed successfully' }))
    } catch (e) {
      const axiosErr = e as AxiosError
      const status = axiosErr.response?.status
      const message = axiosErr.message

      dispatch(errorOccurred({ statusCode: status, message: message }))
    } finally {
      dispatch(stopLoading())
    }
  }
}
