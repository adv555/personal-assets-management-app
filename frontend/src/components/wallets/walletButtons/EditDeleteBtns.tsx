import React from 'react'
import { Button } from 'components/common/buttons/Button'
import { ReactComponent as PenIcon } from 'assets/icons/pen.svg'
import { ReactComponent as DeleteIcon } from 'assets/icons/delete-icon.svg'
import { ShowWalletFooter } from '../Wallet'

interface IEditDeleteBtnsProps {
  setWalletFooter: (value: ShowWalletFooter) => void
}

export const EditDeleteBtns: React.FC<IEditDeleteBtnsProps> = ({
  setWalletFooter,
}) => {
  return (
    <div className="flex items-center justify-around">
      <Button
        icon={<PenIcon />}
        type="button"
        btnName="tertiary2"
        label="Edit"
        onClick={() => {
          setWalletFooter(ShowWalletFooter.UPDATE)
        }}
      />
      <Button
        icon={<DeleteIcon />}
        type="button"
        btnName="delete"
        label="Delete"
        onClick={() => {
          setWalletFooter(ShowWalletFooter.CONFIRM_DELETE)
        }}
      />
      <Button
        type="button"
        btnName="delete"
        label="Cancel"
        className="text-lime-600"
        onClick={() => {
          setWalletFooter(ShowWalletFooter.CLOSE)
        }}
      />
    </div>
  )
}
