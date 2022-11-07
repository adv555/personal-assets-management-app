import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { format } from 'date-fns'

import { PrimaryInfo, DashboardSideBar } from './components'
import { Wallet, Transaction, Period } from './interfaces'

import { fetchReportForPeriod, fetchWallets } from './service/api'
import { Totals } from './types'
import { Link } from 'react-router-dom'
import { AppRoute } from '../../common/enums/app-route.enum'

const now = new Date()
const year = now.getFullYear()
const month = now.getMonth()
const firstDayOfMonth = format(new Date(year, month, 1), 'yyyy-MM-dd')
const today = format(now, 'yyyy-MM-dd')

const initialPeriod: Period = {
  startDate: firstDayOfMonth,
  endDate: today,
}

const Reports = () => {
  const [searchParams, setSearchParams] = useSearchParams({})

  const [period, setPeriod] = useState<Period>(initialPeriod)
  const [wallets, setWallets] = useState<Array<Wallet>>([])
  const [selectedWallet, setSelectedWallet] = useState<Wallet>({} as Wallet)
  const [totals, setTotals] = useState<Totals>({
    incomeSum: 0,
    outcomeSum: 0,
  })
  const [transactions, setTransactions] = useState<Transaction[]>(
    [] as Transaction[],
  )

  useEffect(() => {
    const getWallets = async () => {
      const data = await fetchWallets()

      if (data.length === 0) return

      const sortedWallets = data?.sort((a: Wallet, b: Wallet) =>
        a.wallet_name > b.wallet_name ? 1 : -1,
      )

      setWallets(sortedWallets)
      setSelectedWallet(sortedWallets[0])

      setSearchParams((prev) => {
        return { ...prev, walletId: sortedWallets[0].id, ...period }
      })
    }

    getWallets()
  }, [])

  const getPeriodData = async (selectedWalletId: number | string) => {
    if (!selectedWalletId) return

    const { periodReport, sums } = await fetchReportForPeriod(
      selectedWalletId,
      period.startDate,
      period.endDate,
    )

    const newTotals = { incomeSum: 0, outcomeSum: 0 }

    sums.forEach((s: { isIncome: boolean; sum: number }) => {
      if (s.isIncome === true) {
        return (newTotals.incomeSum = s.sum / 100)
      } else return (newTotals.outcomeSum = s.sum / 100)
    })

    setTotals(newTotals)
    setTransactions(periodReport)
  }

  useEffect(() => {
    const walletId = searchParams.get('walletId')

    if (!walletId) return

    getPeriodData(walletId)
  }, [searchParams])

  // Period and Wallet Inputs handlers
  const onWalletChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const walletName = e.target.value
    const targetWallet = wallets.find((w) => w.wallet_name === walletName)

    if (!targetWallet) return

    setSelectedWallet(targetWallet)
    setSearchParams((prev) => {
      return { ...prev, walletId: targetWallet.id, ...period }
    })
  }

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setPeriod((prev) => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault()

    setPeriod((prev) => {
      return { ...prev, ...period }
    })

    setSearchParams((prev) => {
      return { ...prev, walletId: selectedWallet.id, ...period }
    })
  }

  return (
    <div className="flex gap-8 h-screen flex-1">
      {wallets.length ? (
        <PrimaryInfo
          selectedWallet={selectedWallet}
          totals={totals}
          wallets={wallets}
          onWalletChange={onWalletChange}
          transactions={transactions}
          period={period}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      ) : (
        <div className="flex flex-col gap-2 flex-1 basis-2/3 h-screen text-center">
          <h2 className=" text-Ag-18 font-semibold mb-4">
            No Wallets To Show{' '}
          </h2>
          <p>Create your very first wallet</p>
          <Link
            className="text-blue-500 underline uppercase"
            to={'../my-wallets'}
          >
            My-Wallets
          </Link>
        </div>
      )}
      <DashboardSideBar />
    </div>
  )
}

export default Reports
