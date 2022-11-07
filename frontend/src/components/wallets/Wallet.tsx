import { Typography } from 'components/common/Typography'
import React, { useState } from 'react'
import walletIcon from '../../assets/icons/wallet-icon.svg'
import { IWallet } from 'redux/slice/walletsSlice'
import { ReactComponent as SettingIcon } from 'assets/icons/settings.svg'
import { EditDeleteBtns } from './walletButtons/EditDeleteBtns'
import { ConfirmDelete } from './walletButtons/ConfirmDelete'
import { UpdateWalletForm } from './UpdateWalletForm'
import clsx from 'clsx'
import { convertToMoney } from './helpers/convertFunction'
import { useAppSelector } from 'hooks/useAppDispatch'
import { currencyIcon } from './helpers/currencyIcon'
import { Currencies } from 'common/enums/currency.enum'
import { wordToUpperCase } from './helpers/wordToUC'
import { WalletStatus } from 'common/enums/walletStatus.enum'

export enum ShowWalletFooter {
  CLOSE = 'close',
  SETTING = 'setting',
  CONFIRM_DELETE = 'confirm',
  UPDATE = 'update',
}

interface WalletProps {
  wallet: IWallet
  onClick: (wallet: IWallet) => void
  className?: string
}

export const Wallet: React.FC<WalletProps> = ({
  wallet,
  onClick,
  className,
}) => {
  const [showWalletFooter, setShowWalletFooter] = useState(
    ShowWalletFooter.CLOSE,
  )

  const activeWallet = useAppSelector((state) => state.wallets.activeWallet)

  return (
    <li
      onClick={() => onClick(wallet)}
      className={clsx(
        'w-11/12 bg-gradient-to-b px-3 pt-3 rounded-md cursor-pointer',
        wallet.currency === Currencies.UAH && 'from-blue-300 to-yellow-200',
        wallet.currency === Currencies.EUR && 'from-orange-300 to-purple-300',
        wallet.currency === Currencies.USD && 'from-gray-200 to-green-400',
        className,
        activeWallet && activeWallet.id === wallet.id
          ? 'shadow-md shadow-lime-500 scale-105'
          : null,
      )}
    >
      <div className="flex items-center">
        <img src={walletIcon} alt="wallet" />
        <Typography className="ml-3" type="h4">
          {wallet.wallet_name}
        </Typography>
      </div>
      <div className="bg-gray-300 h-px mt-2 mb-5"></div>
      <Typography className="text-center text-zinc-500" type="Ag-16-regular">
        Your balance
      </Typography>
      <Typography
        className="text-center text-2xl"
        type="Ag-18-semibold"
      >{`${currencyIcon(wallet.currency)} ${convertToMoney(
        wallet.total_balance,
      )}`}</Typography>
      <div className="flex items-center justify-around">
        <div className="flex flex-col items-center">
          <Typography className="text-zinc-500" type="Ag-16-regular">
            Currency
          </Typography>
          <Typography type="Ag-18-semibold">{wallet.currency}</Typography>
        </div>
        <div className="flex flex-col items-center">
          <Typography className="text-zinc-500" type="Ag-16-regular">
            Status
          </Typography>
          <Typography
            className={clsx(
              wallet.status === WalletStatus.OPEN
                ? 'text-green-600'
                : 'text-red-600',
            )}
            type="Ag-18-semibold"
          >
            {wordToUpperCase(wallet.status)}
          </Typography>
          {wallet.status === WalletStatus.CLOSE && (
            <Typography
              className="text-red-600"
              type="Ag-12-normal"
            >{`You can't change costs sum`}</Typography>
          )}
        </div>
      </div>
      <div className="bg-gray-300 h-px mt-3"></div>
      {showWalletFooter === ShowWalletFooter.SETTING && (
        <EditDeleteBtns setWalletFooter={setShowWalletFooter} />
      )}
      {showWalletFooter === ShowWalletFooter.CONFIRM_DELETE && (
        <ConfirmDelete
          walletId={wallet.id}
          setWalletFooter={setShowWalletFooter}
        />
      )}
      {showWalletFooter === ShowWalletFooter.UPDATE && (
        <UpdateWalletForm
          wallet={wallet}
          setWalletFooter={setShowWalletFooter}
        />
      )}
      {showWalletFooter === ShowWalletFooter.CLOSE && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowWalletFooter(ShowWalletFooter.SETTING)}
            className="inline-block p-4 hover:scale-110"
          >
            <SettingIcon />
          </button>
        </div>
      )}
    </li>
  )
}
