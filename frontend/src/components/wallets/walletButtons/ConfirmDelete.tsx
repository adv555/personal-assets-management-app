import { LoadingStatus } from 'common/enums/loading-status'
import { Button } from 'components/common/buttons/Button'
import { Typography } from 'components/common/Typography'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React from 'react'
import { deleteWallet } from 'redux/slice/walletsSlice'
import { ShowWalletFooter } from '../Wallet'

interface IConfirmDeleteProps {
  walletId: number
  setWalletFooter: (value: ShowWalletFooter) => void
}

export const ConfirmDelete: React.FC<IConfirmDeleteProps> = ({
  setWalletFooter,
  walletId,
}) => {
  const dispatch = useAppDispatch()
  const loading = useAppSelector((state) => state.wallets.loading)

  return (
    <div>
      <Typography className="text-center mt-2" type="Ag-18-semibold">
        Are you sure to delete your wallet?
      </Typography>
      <div className="flex items-center justify-around">
        <Button
          type="button"
          btnName="delete"
          disabled={loading === LoadingStatus.LOADING}
          label="OK"
          onClick={() => {
            dispatch(deleteWallet(walletId))
          }}
        />
        <Button
          type="button"
          btnName="tertiary2"
          label="Cancel"
          onClick={() => {
            setWalletFooter(ShowWalletFooter.CLOSE)
          }}
        />
      </div>
    </div>
  )
}
