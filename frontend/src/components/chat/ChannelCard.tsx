import React from 'react'
import { formatRelative } from 'date-fns'
import { Typography } from 'components/common/Typography'
import { Avatar } from 'components/common/avatar/Avatar'

interface MessageCardProps {
  avatar?: string | null
  name?: string
  timeStamp: string
  isActiveChannel: boolean
  onClick: () => void
  lastMessage: string
}

export const ChannelCard: React.FC<MessageCardProps> = ({
  avatar,
  name,
  timeStamp,
  isActiveChannel,
  lastMessage,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={
        (isActiveChannel ? 'bg-gray-ultralight ' : '') +
        'w-full min-h-[74px] flex flex-col justify-center items-center lg:flex-row px-4 py-2 lg:p-4 gap-2 hover:bg-gray-light hover:cursor-pointer rounded-lg transition-all duration-200'
      }
    >
      <div className="flex items-center justify-center w-11 h-11 bg-green-light lg:mr-3 rounded-full overflow-hidden shrink-0">
        <Avatar img={avatar} alt={name} avatarType={'channel'} />
      </div>
      <div className="flex flex-col w-full">
        <Typography
          type="Ag-13-bold"
          className=" text-center lg:text-left w-full whitespace-nowrap  lg:mb-2"
        >
          {name}
        </Typography>
        <div className="hidden lg:flex flex-row justify-between">
          <Typography type="Ag-13-medium" className="w-full">
            {lastMessage || 'No messages yet'}
          </Typography>
          <Typography
            type="Ag-12-normal"
            className="w-full lg:text-end text-gray-400"
          >
            {/* {timeStamp} */}
            {formatRelative(new Date(timeStamp), new Date()) || ''}
          </Typography>
        </div>
      </div>
    </div>
  )
}
