import React from 'react'
import { SectionTitle } from 'components/settings/SectionTitle'
import { ProfileCard } from './ProfileCard'
import { Messenger } from './Messenger/Messenger'
import { IMessage } from './interfaces'
import { IUserProfile } from 'redux/slice/userProfile/userProfile.slice'

interface Props {
  conversationId: number | null
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  showModal: boolean
  user: IUserProfile
  messages: IMessage[]
}

export const ChatPanel: React.FC<Props> = ({
  showModal,
  setShowModal,
  conversationId,
  user,
  messages,
}) => {
  const { avatarPath, firstName, lastName, phone, email } = user

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="border-b pb-2">
        <SectionTitle title={'Messages'} />
        <div>
          <ProfileCard
            avatar={avatarPath || null}
            name={`${firstName} ${lastName}`}
            phone={phone ? phone : email}
            setShowModal={setShowModal}
            showModal={showModal}
          />
        </div>
      </div>
      <Messenger messages={messages} conversationId={conversationId} />
    </div>
  )
}
