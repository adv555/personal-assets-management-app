import { createSlice } from '@reduxjs/toolkit'
import { IConversation } from 'components/chat/interfaces'

interface ConversationsState {
  conversations: IConversation[]
  currentConversationId: number | null
}

const initialState: ConversationsState = {
  conversations: [],
  currentConversationId: null,
}

export const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    getConversationsSuccess: (state, action) => ({
      ...state,
      conversations: action.payload,
    }),
    getConversationsFailure: () => ({ ...initialState }),

    addConversationSuccess: (state, action) => ({
      ...state,
      conversations: [...state.conversations, action.payload],
    }),

    addConversationFailure: () => ({ ...initialState }),

    setCurrentConversation: (state, action) => ({
      ...state,
      currentConversationId: action.payload,
    }),
    resetConversation: () => ({ ...initialState }),
  },
})

export const {
  getConversationsSuccess,
  getConversationsFailure,
  addConversationSuccess,
  addConversationFailure,
  setCurrentConversation,
  resetConversation,
} = conversationsSlice.actions

export default conversationsSlice.reducer
