import { AxiosError } from 'axios'
import api from 'axios/axios'
import { CreateMessageParams } from 'components/chat/interfaces'
import { AppDispatch } from 'redux/store'
import { errorOccurred, resetError } from '../error/error.slice'
import { startLoading, stopLoading } from '../loader/loader.slice'
import { getMessagesFailure, getMessagesSuccess } from './messages.slice'

const getAllMessagesByConversationId = (conversationId: number) => {
  return api.get(`/messages/${conversationId}`)
}

export const postNewMessage = ({
  conversationId,
  content,
}: CreateMessageParams) => {
  return api.post('/messages', { conversationId, content })
}

export const fetchMessagesByConversationId = (conversationId: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(resetError())
      dispatch(startLoading())

      const response = await getAllMessagesByConversationId(conversationId)

      dispatch(getMessagesSuccess(response.data))
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

export const createNewMessage = ({
  conversationId,
  content,
}: CreateMessageParams) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(resetError())
      dispatch(startLoading())

      await postNewMessage({ conversationId, content })
    } catch (e) {
      const axiosErr = e as AxiosError
      const status = axiosErr.response?.status
      const message = axiosErr.message

      dispatch(errorOccurred({ statusCode: status, message: message }))

      dispatch(getMessagesFailure())
    } finally {
      dispatch(stopLoading())
    }
  }
}
