import { AxiosError } from 'axios'
import api from 'axios/axios'
import { AppDispatch } from 'redux/store'
import { resetConversation } from '../conversations/conversations.slice'
import { errorOccurred, resetError } from '../error/error.slice'
import { startLoading, stopLoading } from '../loader/loader.slice'
import { resetMessages } from '../messages/messages.slice'
import { resetSuccess, successAction } from '../success/success.slice'
import {
  IUserProfile,
  getUserSuccess,
  getUserFailure,
  updateUserSuccess,
  updateUserFail,
  removeUserSuccess,
  resetUserProfile,
} from './userProfile.slice'

const getCurrentUserId = () => {
  return api.get('/user/current')
}

export const getUserById = (userId: number) => {
  return api.get(`/user/${userId}`)
}

export const getUserByQuery = (
  params?: URLSearchParams | Record<string, string>,
) => {
  return api.get('/user', { params })
}

const updateUser = (user: IUserProfile | { password: string }) => {
  return api.patch('/user', user)
}

const updateUserAvatar = (formData: FormData) => {
  return api.patch('/user/avatar', formData)
}

const deleteUser = (userData: { password: string }) => {
  return api.delete('/user', { data: userData })
}

export const fetchUserProfile = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(resetError())
      dispatch(startLoading())
      const response = await getCurrentUserId()

      dispatch(getUserSuccess(response.data))
    } catch (e) {
      const axiosErr = e as AxiosError
      const status = axiosErr.response?.status
      const message = axiosErr.message

      dispatch(errorOccurred({ statusCode: status, message: message }))

      dispatch(getUserFailure())
    } finally {
      dispatch(stopLoading())
    }
  }
}

export const updateUserProfile = (
  user: IUserProfile | { password: string },
) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(resetError())
      dispatch(resetSuccess())
      dispatch(startLoading())

      const response = await updateUser(user)

      dispatch(updateUserSuccess(response.data))

      if (user.password) {
        dispatch(successAction({ message: 'Password updated successfully' }))
      } else {
        dispatch(successAction({ message: 'Profile updated successfully' }))
      }
    } catch (e) {
      const axiosErr = e as AxiosError
      const status = axiosErr.response?.status
      const message = axiosErr.message

      dispatch(errorOccurred({ statusCode: status, message: message }))
      if (!user.password) {
        dispatch(updateUserFail())
      }
    } finally {
      dispatch(stopLoading())
    }
  }
}

export const updateUserAvatarProfile = (formData: FormData) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(resetError())
      dispatch(resetSuccess())
      dispatch(startLoading())

      const response = await updateUserAvatar(formData)

      dispatch(updateUserSuccess(response.data))
      dispatch(successAction({ message: 'Avatar updated successfully' }))
    } catch (e) {
      const axiosErr = e as AxiosError
      const status = axiosErr.response?.status
      const message = axiosErr.message

      dispatch(errorOccurred({ statusCode: status, message: message }))
      dispatch(updateUserFail())
    } finally {
      dispatch(stopLoading())
    }
  }
}

export const deleteUserProfile = (userData: { password: string }) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(resetError())
      dispatch(resetSuccess())
      dispatch(startLoading())

      await deleteUser(userData)

      dispatch(removeUserSuccess())
      dispatch(successAction({ message: 'User deleted successfully' }))
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

export const resetUserProfileStore = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(resetError())
    dispatch(resetSuccess())
    dispatch(resetUserProfile())
    dispatch(resetConversation())
    dispatch(resetMessages())
  }
}
