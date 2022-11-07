import React, { useContext, useEffect, useState } from 'react'
import { ChatSidebar } from 'components/chat/ChatSidebar'
import { ChatPanel } from 'components/chat/ChatPanel'
import { CreateConversationModal } from 'components/chat/Modal/CreateConversationModal'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import { fetchUserConversations } from 'redux/slice/conversations/conversations.actionCreator'
import { fetchMessagesByConversationId } from 'redux/slice/messages/messages.actionCreator'
import { SocketContext } from 'utils/context/SocketContext'
import { IMessage, IMessageEventPayload } from 'components/chat/interfaces'

const Chats: React.FC = () => {
  const dispatch = useAppDispatch()
  const socket = useContext(SocketContext)
  const [showModal, setShowModal] = useState(false)

  const user = useAppSelector((state) => state.userProfile)
  const { conversations, currentConversationId } = useAppSelector(
    (state) => state.conversations,
  )
  const currentChatMessages = useAppSelector((state) => state.messages.messages)

  const [conversationId, setConversationId] = useState<number | null>(null)
  const [messages, setMessages] = useState<IMessage[]>(currentChatMessages)

  useEffect(() => {
    dispatch(fetchUserConversations())
  }, [])

  useEffect(() => {
    if (messages.length === 0) return

    dispatch(fetchUserConversations())
  }, [messages, dispatch])

  useEffect(() => {
    if (currentConversationId) {
      setConversationId(currentConversationId)
      dispatch(fetchMessagesByConversationId(currentConversationId))
    }
  }, [currentConversationId, dispatch])

  useEffect(() => {
    if (conversations.length === 0) return

    conversationId !== null
      ? setConversationId(conversationId)
      : setConversationId(conversations[0].id)
  }, [conversations])

  useEffect(() => {
    if (currentChatMessages.length === 0) return

    setMessages(currentChatMessages)
  }, [currentChatMessages])

  useEffect(() => {
    if (!conversationId) return

    dispatch(fetchMessagesByConversationId(conversationId))
    setMessages([...currentChatMessages])
  }, [conversationId, dispatch])

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to socket')
    })
    socket.on('onMessage', (payload: IMessageEventPayload) => {
      const { conversation, ...message } = payload

      setMessages((prev) => [...prev, message])
    })

    return () => {
      socket.off('connect')
      socket.off('onMessage')
    }
  }, [socket])

  const onChannelClick = (id: number) => {
    if (conversationId === id) return
    setMessages([])
    setConversationId(id)
  }

  return (
    <>
      <div className="w-full  flex flex-row h-full border-4 rounded-lg border-gray-ultralight">
        <div className="w-1/2 h-full p-4 border-r relative">
          {showModal && (
            <CreateConversationModal
              showModal={showModal}
              setShowModal={setShowModal}
              closeModal={() => setShowModal(false)}
            />
          )}
          <ChatSidebar
            user={user}
            conversations={conversations}
            onChannelClick={onChannelClick}
            conversationId={conversationId}
          />
        </div>
        <div className="w-1/2 h-full p-4">
          <ChatPanel
            user={user}
            conversationId={conversationId}
            messages={messages}
            showModal={showModal}
            setShowModal={setShowModal}
          />
        </div>
      </div>
    </>
  )
}

export default Chats
