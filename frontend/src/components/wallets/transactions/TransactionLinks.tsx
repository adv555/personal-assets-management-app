import clsx from 'clsx'
import { WalletStatus } from 'common/enums/walletStatus.enum'
import { Typography } from 'components/common/Typography'
import { useAppSelector } from 'hooks/useAppDispatch'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { ShowTransactionFragment } from '../helpers/enums/showTransactionFragment.enum'

interface IDetails {
  title: string
  listName: string
  createName: string
}
interface ITransactionLinksProps {
  type: 'income' | 'cost'
  show: ShowTransactionFragment
  setShow: (value: ShowTransactionFragment) => void
  details: IDetails
}

export const TransactionLinks: React.FC<ITransactionLinksProps> = ({
  type,
  show,
  setShow,
  details,
}) => {
  const { title, listName, createName } = details
  const activeWallet = useAppSelector((state) => state.wallets.activeWallet)

  return (
    <>
      <Typography type="h4">{`${title} of '${activeWallet?.wallet_name}'`}</Typography>
      <nav>
        <ul className="mt-2 flex">
          <li>
            <NavLink
              className={clsx(
                'text-gray-500 hover:text-lime-500 transition-colors hover:underline hover:underline-offset-4 mr-3',
                show === ShowTransactionFragment.LIST
                  ? 'text-black underline underline-offset-4 font-bold'
                  : '',
              )}
              onClick={() => {
                setShow(ShowTransactionFragment.LIST)
              }}
              to="#"
            >
              {listName}
            </NavLink>
          </li>
          <li
            className={clsx(
              type === 'cost' && activeWallet?.status === WalletStatus.CLOSE
                ? 'hidden'
                : 'block',
            )}
          >
            <NavLink
              className={clsx(
                'text-gray-500 hover:text-lime-500 transition-colors hover:underline hover:underline-offset-4',
                show === ShowTransactionFragment.CREATE
                  ? 'text-black underline underline-offset-4 font-bold'
                  : '',
              )}
              onClick={() => {
                setShow(ShowTransactionFragment.CREATE)
              }}
              to="#"
            >
              {createName}
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  )
}
