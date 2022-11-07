/* eslint-disable @typescript-eslint/no-empty-function */
import { createSlice } from '@reduxjs/toolkit'
import { IMessage } from 'components/chat/interfaces'

interface MessagesState {
  messages: IMessage[]
}

const initialState: MessagesState = {
  messages: [],
}

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    getMessagesSuccess: (state, action) => ({
      ...state,
      messages: action.payload,
    }),
    getMessagesFailure: () => ({ ...initialState }),
    resetMessages: () => ({ ...initialState }),
  },
})

export const { getMessagesSuccess, getMessagesFailure, resetMessages } =
  messagesSlice.actions

export default messagesSlice.reducer
