import React from 'react'
import { toast } from 'react-toastify'
import { MessageLink } from './MessageLink'
// import { MessageLink } from './MessageLink'

export const notifyInfo = (text: string) =>
  toast.info(`${text}`, {
    position: 'top-right',
    hideProgressBar: true,
    autoClose: 1000,
  })

export const notifyError = (text: string) =>
  toast.error(`${text}`, {
    position: 'top-right',
    hideProgressBar: true,
    autoClose: 2000,
  })

export const notifySuccess = (text: string) =>
  toast.success(`${text}`, {
    position: 'top-right',
    hideProgressBar: true,
    autoClose: 2000,
  })

export interface IMessage {
  id: number
  conversationId: number
  senderId: number
  text: string
  createdAt: Date
  updatedAt: Date
}

export const notifyMessage = (text: string, message: IMessage) => {
  toast.success(<MessageLink message={message} notificationText={text} />, {
    position: 'top-right',
    hideProgressBar: true,
  })
}
