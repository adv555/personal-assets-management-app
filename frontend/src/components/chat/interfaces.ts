export interface IUser {
  id: number
  email: string
  firstName: string
  lastName: string
  avatarPath: string
  phone: string
}

export type IAuthor = IUser

export interface IConversation {
  id: number
  creator: IUser
  recipient: IUser
  messages: IMessage[]
  createdAt: string
  updatedAt?: string
}

export interface IMessage {
  id: number
  content: string
  author: IAuthor
  // conversation: IConversation
  createdAt: string
  updatedAt?: string
}

export interface IMessageEventPayload {
  id: number
  content: string
  author: IAuthor
  conversation: IConversation
  createdAt: string
  updatedAt?: string
}

export type CreateMessageParams = {
  conversationId: number
  content: string
}

export type CreateConversationParams = {
  recipientId: number
  message: string
}
