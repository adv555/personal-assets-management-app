import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React, { useEffect, useState } from 'react'
import {
  fetchWallets,
  IWallet,
  setActiveWallet,
  setWalletError,
  setWalletSuccess,
} from 'redux/slice/walletsSlice'
import { Wallet } from './Wallet'
import { Button } from 'components/common/buttons/Button'
import { ReactComponent as AddIcon } from '../../assets/icons/add-icon.svg'
import { AddWalletForm } from './AddWalletForm'
import { notifyError, notifySuccess } from 'components/common/notifications'
import { WalletSlider } from './WalletSlider'

export const WalletsList: React.FC = () => {
  const [showForm, setShowForm] = useState(false)

  const toggleShowAddForm = () => {
    setShowForm(!showForm)
  }

  const dispatch = useAppDispatch()

  const { wallets, activeWallet, errorMessage, successMessage } =
    useAppSelector((state) => state.wallets)
  const { incomes } = useAppSelector((state) => state.incomes)
  const { costs } = useAppSelector((state) => state.costs)

  useEffect(() => {
    dispatch(fetchWallets(''))
  }, [incomes, costs])

  useEffect(() => {
    errorMessage && notifyError(errorMessage)

    return () => {
      dispatch(setWalletError(null))
    }
  }, [errorMessage])

  useEffect(() => {
    successMessage && notifySuccess(successMessage)

    return () => {
      dispatch(setWalletSuccess(null))
    }
  }, [successMessage])

  const setActiveWalletId = (wallet: IWallet) => {
    if (activeWallet && wallet.id === activeWallet.id) return null
    dispatch(setActiveWallet(wallet))
  }

  return (
    <div className="row-span-2">
      {wallets.length > 3 && (
        <WalletSlider setActiveWallet={setActiveWalletId} />
      )}

      {wallets.length <= 3 && (
        <ul className="grid grid-cols-1 gap-y-5">
          {wallets &&
            wallets.map((wallet) => (
              <Wallet
                key={wallet.id}
                wallet={wallet}
                onClick={setActiveWalletId}
              />
            ))}
        </ul>
      )}

      {showForm ? (
        <AddWalletForm toggleShowAddForm={toggleShowAddForm} />
      ) : (
        <div className="flex mt-4 w-11/12">
          <Button
            icon={<AddIcon />}
            type="button"
            btnName={'primary'}
            label="Add Wallet"
            onClick={toggleShowAddForm}
          />
        </div>
      )}
    </div>
  )
}
