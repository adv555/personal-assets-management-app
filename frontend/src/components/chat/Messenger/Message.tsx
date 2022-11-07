import React from 'react'
import { formatRelative } from 'date-fns'
import { IAuthor } from '../interfaces'
import { useAppSelector } from 'hooks/useAppDispatch'
import { Avatar } from 'components/common/avatar/Avatar'

interface MessageProps {
  message: {
    content: string
    author: IAuthor
    createdAt: string
  }
}

export const Message = ({
  message: { content, author, createdAt },
}: MessageProps) => {
  const user = useAppSelector((state) => state.userProfile)

  return (
    <div className="flex flex-col mb-5 last:mb-0 px-5 pt-4">
      <div
        className={`flex items-center gap-3  ${
          author.id === user.id ? 'flex-row-reverse text-orange' : 'text-blue'
        }`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${
            author.id === user.id ? 'bg-orange' : 'bg-blue'
          }`}
        >
          <Avatar
            img={author.avatarPath}
            alt={author.firstName}
            avatarType={'message'}
          />
        </div>
        <div className={`text-Ag-14 font-bold whitespace-nowrap`}>
          {`${author.firstName} ${author.lastName}`}
        </div>
      </div>
      <div
        className={`flex justify-between p-2 ${
          author.id === user.id && 'flex-row-reverse'
        }`}
      >
        <div className="text-sm text-gray-600 bg-gray-ultralight rounded-full px-3 py-2 w-3/5">
          {content}
        </div>
        <div className="text-xs text-gray-400">
          {formatRelative(new Date(createdAt), new Date())}
        </div>
      </div>
    </div>
  )
}
