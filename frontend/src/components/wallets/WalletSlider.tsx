import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React from 'react'
import { IWallet, setFirstIndex, setLastIndex } from 'redux/slice/walletsSlice'
import { ReactComponent as Down } from '../../assets/icons/slide-down.svg'
import { ReactComponent as Up } from '../../assets/icons/slide-up.svg'
import { Wallet } from './Wallet'

interface IWalletSliderProps {
  setActiveWallet: (value: IWallet) => void
}

export const WalletSlider: React.FC<IWalletSliderProps> = ({
  setActiveWallet,
}) => {
  const dispatch = useAppDispatch()

  const { wallets, firstWalletIndex, lastWalletIndex } = useAppSelector(
    (state) => state.wallets,
  )

  const nextWallet = () => {
    if (lastWalletIndex >= wallets.length - 1) {
      dispatch(setFirstIndex(0))
      dispatch(setLastIndex(2))
    } else {
      dispatch(setFirstIndex(firstWalletIndex + 1))
      dispatch(setLastIndex(lastWalletIndex + 1))
    }
  }

  const prewWallet = () => {
    if (firstWalletIndex <= 0) {
      dispatch(setFirstIndex(wallets.length - 3))
      dispatch(setLastIndex(wallets.length - 1))
    } else {
      dispatch(setFirstIndex(firstWalletIndex - 1))
      dispatch(setLastIndex(lastWalletIndex - 1))
    }
  }

  return (
    <>
      <div
        className="flex justify-center mb-5 cursor-pointer hover:scale-105"
        onClick={prewWallet}
      >
        <Up />
      </div>
      <ul className="grid grid-cols-1 gap-y-5">
        {wallets &&
          wallets.map(
            (wallet, index) =>
              index >= firstWalletIndex &&
              index <= lastWalletIndex && (
                <Wallet
                  key={wallet.id}
                  wallet={wallet}
                  onClick={() => setActiveWallet(wallet)}
                />
              ),
          )}
      </ul>
      <div
        className="flex justify-center mt-5 cursor-pointer hover:scale-105"
        onClick={nextWallet}
      >
        <Down />
      </div>
    </>
  )
}
