import React, { useState } from 'react'
import { ChannelCard } from './ChannelCard'
import { Search } from './Search/Search'
import { IConversation } from 'components/chat/interfaces'
import { IUserProfile } from 'redux/slice/userProfile/userProfile.slice'

interface ChatSidebarProps {
  onChannelClick: (id: number) => void
  conversations: IConversation[]
  user: IUserProfile
  conversationId?: number | null
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  onChannelClick,
  conversations,
  user,
  conversationId,
}) => {
  const [searchQuery, setSearchQuery] = useState('')

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value

    setSearchQuery(query)
  }

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="border-b pb-4">
        <Search onSearch={onSearch} searchQuery={searchQuery} />
      </div>
      <div className="h-full max-h-screen overflow-y-auto flex flex-col flex-grow ">
        <div>
          {conversations.length !== 0 ? (
            conversations
              .filter((conversation) => {
                if (searchQuery === '') return conversation
                else if (
                  conversation.recipient.firstName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  conversation.recipient.lastName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  conversation.creator.firstName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  conversation.creator.lastName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                ) {
                  return conversation
                }
              })
              .map(({ id, messages, recipient, creator }) => (
                <ChannelCard
                  key={id}
                  avatar={
                    user.id === creator.id
                      ? recipient.avatarPath || null
                      : creator.avatarPath || null
                  }
                  name={
                    user.id === creator.id
                      ? `${recipient.firstName} ${recipient.lastName}`
                      : `${creator.firstName} ${creator.lastName}`
                  }
                  timeStamp={messages[0].createdAt || 'today at 12:00 PM'}
                  isActiveChannel={conversationId === id ? true : false}
                  lastMessage={messages[0].content || 'Hello there!'}
                  onClick={() => onChannelClick(id)}
                />
              ))
          ) : (
            <div className="text-center text-gray-500">
              No conversations yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
