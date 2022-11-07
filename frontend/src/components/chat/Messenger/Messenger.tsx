import React from 'react'
import { IAuthor } from '../interfaces'
import { Message } from './Message'
import { MessengerForm } from './MessengerForm'

interface Props {
  messages: {
    id: number
    content: string
    author: IAuthor
    createdAt: string
  }[]
  conversationId: number | null
}

export const Messenger: React.FC<Props> = ({ messages, conversationId }) => {
  return (
    <div className="h-5/6 flex flex-col justify-between gap-5 ">
      <div className="h-5/6 justify-between overflow-y-auto overflow-x-hidden flex flex-col-reverse ">
        <div>
          {messages.map(({ id, content, author, createdAt }) => (
            <Message
              key={id}
              message={{
                content,
                author,
                createdAt,
              }}
            />
          ))}
        </div>
      </div>
      <div className="pt-4 border-t relative ">
        <MessengerForm conversationId={conversationId} />
      </div>
    </div>
  )
}
