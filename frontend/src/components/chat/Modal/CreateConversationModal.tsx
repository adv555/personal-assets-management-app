import React, { Dispatch } from 'react'
import { ReactComponent as CloseIcon } from 'assets/icons/close.svg'
import { Typography } from 'components/common/Typography/Typography'

import { ModalHeader } from '.'
import { ModalContainer } from './ModalContainer'
import { CreateConversationForm } from './CreateConversationForm'

type Props = {
  showModal: boolean
  closeModal: () => void
  setShowModal: Dispatch<React.SetStateAction<boolean>>
}

export const CreateConversationModal: React.FC<Props> = ({
  showModal,
  setShowModal,
  closeModal,
}) => {
  return (
    <ModalContainer showModal={showModal} onClose={closeModal}>
      <ModalHeader>
        <Typography type={'Ag-13-bold'}>Add contact</Typography>
        <CloseIcon
          onClick={closeModal}
          className="absolute w-5 h-5 right-2 top-2"
        />
      </ModalHeader>
      <CreateConversationForm setShowModal={setShowModal} />
    </ModalContainer>
  )
}
