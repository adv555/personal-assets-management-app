import * as React from 'react'
import BalanceBox from './BalanceBox'
import Chart from './Chart'
import { Period, Transaction, Wallet } from '../interfaces'
import { Totals } from '../types'

const PrimaryInfo = ({
  wallets,
  onWalletChange,
  selectedWallet,
  totals,
  transactions,
  period,
  handleChange,
  handleSubmit,
}: {
  wallets: Wallet[]
  onWalletChange: React.ChangeEventHandler<HTMLSelectElement>
  selectedWallet: Wallet
  totals: Totals
  transactions: Transaction[]
  period: Period
  handleChange: React.ChangeEventHandler<HTMLInputElement>
  handleSubmit: React.FormEventHandler
}) => {
  const options = wallets.map((w) => {
    return (
      <option
        key={w.wallet_name}
        value={w.wallet_name}
      >{`${w.wallet_name} (${w.currency})`}</option>
    )
  })

  return (
    <div className="flex flex-col gap-2 flex-grow h-screen">
      <div className=" basis-1/6 border">
        <div className="flex justify-center items-center  p-2">
          <label className="mx-4" htmlFor="wallets">
            Wallet:
          </label>
          <select
            className="w-52 rounded-xl"
            id="wallets"
            onChange={onWalletChange}
          >
            {options}
          </select>
        </div>

        <div className="flex justify-center items-center p-2 uppercase">
          <p className="">
            <span className="mr-4 font-light">Total balance:</span>
            <span className="mr-2 text-2xl">
              {Number(selectedWallet.total_balance / 100).toFixed(2)}
            </span>
            <span className="font-light">{selectedWallet.currency}</span>
          </p>
        </div>
      </div>

      <BalanceBox
        selectedWallet={selectedWallet}
        totals={totals}
        period={period}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />

      <Chart transactions={transactions} />
    </div>
  )
}

export default PrimaryInfo
