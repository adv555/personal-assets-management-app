import { AxiosError } from 'axios'
import api from 'axios/axios'
import { CreateConversationParams } from 'components/chat/interfaces'
import { AppDispatch } from 'redux/store'
import { errorOccurred, resetError } from '../error/error.slice'
import { startLoading, stopLoading } from '../loader/loader.slice'
import { resetSuccess, successAction } from '../success/success.slice'
import {
  getConversationsFailure,
  getConversationsSuccess,
  setCurrentConversation,
} from './conversations.slice'

const getUserConversations = (
  params?: URLSearchParams | Record<string, string>,
) => {
  return api.get('/conversations', { params })
}

export const getConversationById = (conversationId: number) => {
  return api.get(`/conversations/${conversationId}`)
}

const createConversation = ({
  recipientId,
  message,
}: CreateConversationParams) => {
  return api.post('/conversations', { recipientId, message })
}

export const fetchUserConversations = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(resetError())
      dispatch(startLoading())
      const response = await getUserConversations()

      dispatch(getConversationsSuccess(response.data))
    } catch (e) {
      const axiosErr = e as AxiosError
      const status = axiosErr.response?.status
      const message = axiosErr.message

      dispatch(errorOccurred({ statusCode: status, message: message }))

      dispatch(getConversationsFailure())
    } finally {
      dispatch(stopLoading())
    }
  }
}

export const createNewConversation = ({
  recipientId,
  message,
}: CreateConversationParams) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(resetError())
      dispatch(resetSuccess())
      dispatch(startLoading())
      const response = await createConversation({ recipientId, message })

      dispatch(setCurrentConversation(response.data.id))

      dispatch(successAction({ message: 'Conversation created' }))
    } catch (e) {
      const axiosErr = e as AxiosError
      const status = axiosErr.response?.status
      const message = axiosErr.message

      if (status === 409) {
        dispatch(
          errorOccurred({
            statusCode: status,
            message: 'Conversation already exist',
          }),
        )
      } else {
        dispatch(errorOccurred({ statusCode: status, message: message }))
      }
    } finally {
      dispatch(stopLoading())
    }
  }
}
