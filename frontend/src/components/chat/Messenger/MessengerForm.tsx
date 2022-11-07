import React, { useRef, useState } from 'react'
import { ReactComponent as UploadIcon } from 'assets/icons/upload.svg'
import { ReactComponent as SendIcon } from 'assets/icons/send.svg'
import { ReactComponent as EmojiIcon } from 'assets/icons/emoji.svg'
import { useAppDispatch } from 'hooks/useAppDispatch'
import { createNewMessage } from 'redux/slice/messages/messages.actionCreator'
import EmojiPicker from 'emoji-picker-react'

interface Props {
  conversationId: number | null
}

export const MessengerForm: React.FC<Props> = ({ conversationId }) => {
  const dispatch = useAppDispatch()
  const [content, setContent] = useState('')
  const ref = useRef() as React.MutableRefObject<HTMLInputElement>
  const [isActive, setIsActive] = useState(false)

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!conversationId || !content) return

    const message = {
      content,
      conversationId,
    }

    dispatch(createNewMessage(message))
    setContent('')
    setIsActive(false)
  }

  const onEnterPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault()
      handleSendMessage(e as any)
    }
  }

  const handleEmojiClick = (event: any, emojiObject: any) => {
    setContent(content + emojiObject.emoji)
  }

  return (
    <>
      <form onSubmit={handleSendMessage} onKeyDown={onEnterPress}>
        <label htmlFor="chat" className="sr-only">
          Your message
        </label>
        <div className="flex items-center py-2 bg-gray-50 rounded-lg dark:bg-gray-700">
          <label
            htmlFor="file-upload"
            className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-green hover:bg-gray-100"
          >
            <UploadIcon className=" w-8 h-8" />
          </label>
          <input id="file-upload" type="file" className="hidden" />

          <button
            type="button"
            className="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-green hover:bg-gray-100"
            onClick={() => setIsActive(!isActive)}
          >
            <EmojiIcon className=" w-8 h-8" />
            <span className="sr-only">Add emoji</span>
          </button>
          <textarea
            id="chat"
            rows={1}
            className="block mx-4 px-2.5 py-2 w-full text-base text-gray-600 bg-white rounded-lg border border-gray-300 focus:ring-green focus:border-green-light resize-none tracking-wider placeholder:opacity-50"
            placeholder="Your message..."
            value={content}
            onChange={(e) => (setContent(e.target.value), setIsActive(false))}
            onClick={() => setIsActive(false)}
          ></textarea>

          <button
            type="submit"
            className="inline-flex justify-center p-2 text-green rounded-full cursor-pointer hover:bg-gray-100"
            disabled={!content || !conversationId}
          >
            <SendIcon className=" w-8 h-8" />
            <span className="sr-only">Send message</span>
          </button>
        </div>
      </form>
      <div
        ref={ref}
        className={`absolute -top-48 emoji-picker w-full ${
          isActive ? 'block' : 'hidden'
        }`}
      >
        <EmojiPicker
          disableSearchBar
          onEmojiClick={handleEmojiClick}
          pickerStyle={{
            width: '100%',
            maxHeight: '200px',
          }}
        />
      </div>
    </>
  )
}
