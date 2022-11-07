import { CostsList } from 'components/wallets/transactions/Costs/CostsList'
import { IncomesList } from 'components/wallets/transactions/Incomes/IncomesList'
import { WalletsList } from 'components/wallets/WalletsList'
import React from 'react'

const MyWallet: React.FC = () => {
  return (
    <section className="grid grid-cols-1 xl:grid-cols-3 grid-flow-row-dense grid-rows-2 gap-1">
      <WalletsList />
      <IncomesList />
      <CostsList />
    </section>
  )
}

export default MyWallet
