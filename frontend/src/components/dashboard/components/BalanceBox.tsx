import * as React from 'react'
import { BalanceItemProps, Period, Wallet } from '../interfaces'
import { Totals } from '../types'

// Balance Item Component
const BalanceItem = (props: BalanceItemProps) => {
  const { title, currency, amount } = props

  return (
    <div className="flex-1 flex flex-col justify-center items-center bg-gray-ultralight border rounded-md">
      <p className="text-sm font-light capitalize">{title}:</p>
      <p style={{ color: title.toLowerCase() === 'outcome' ? 'red' : 'green' }}>
        <span className="text-md">{amount.toFixed(2)}</span>
        <span className="font-light"> {currency}</span>
      </p>
    </div>
  )
}

// Balance Box Component
const BalanceBox = ({
  selectedWallet,
  totals,
  period,
  handleChange,
  handleSubmit,
}: {
  selectedWallet: Wallet
  totals: Totals
  period: Period
  handleChange: React.ChangeEventHandler<HTMLInputElement>
  handleSubmit: React.FormEventHandler
}) => {
  return (
    <section className="basis-1/6 py-2 flex flex-col gap-2">
      <form className="py-1" onSubmit={handleSubmit}>
        <div className="flex justify-between items-center gap-2 mb-2">
          <input
            className="h-8 text-sm outline-none border-dotted rounded-md border border-lime-300 flex-1 font-light"
            type="date"
            id="startDate"
            name="startDate"
            value={period.startDate}
            max={period.endDate}
            onChange={handleChange}
            required
          />
          <input
            className="h-8 text-sm outline-none border-dotted rounded-md border border-lime-300 flex-1 font-light"
            type="date"
            id="endDate"
            name="endDate"
            value={period.endDate}
            min={period.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <button
          className="text-sm font-medium uppercase bg-gray-ultralight h-8 w-full border rounded-md hover:bg-gray-300 hover:text-white transition-colors"
          type="submit"
        >
          Get report
        </button>
      </form>

      <div className="flex gap-2 py-1">
        <BalanceItem
          title="Income"
          currency={selectedWallet?.currency}
          amount={totals.incomeSum}
        />

        <BalanceItem
          title="Outcome"
          currency={selectedWallet?.currency}
          amount={totals.outcomeSum}
        />
      </div>
    </section>
  )
}

export default BalanceBox
