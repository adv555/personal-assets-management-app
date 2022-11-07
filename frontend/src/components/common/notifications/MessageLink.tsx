import React from 'react'
import { toast } from 'react-toastify'

export interface IMessage {
  id: number
  conversationId: number
  senderId: number
  text: string
  createdAt: Date
  updatedAt: Date
}

interface IProps {
  message: IMessage
  notificationText: string
}
export const MessageLink = ({ message, notificationText }: IProps) => {
  return (
    <a
      href={`/messenger/${message.conversationId}`}
      onClick={() => toast.dismiss()}
    >
      {notificationText}
    </a>
  )
}
