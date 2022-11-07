import { Currency } from './types'

interface ItemMainData {
  id: number | string
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Wallet extends ItemMainData {
  wallet_name: string
  status: string
  total_balance: number
  currency: Currency
}

export interface Transaction {
  isIncome: boolean
  category: string
  sum: number
}

export interface Period {
  startDate: string
  endDate: string
}

export interface BalanceItemProps {
  title: string
  currency: Currency
  amount: number
}

// Chart Interfaces
export interface Dataset {
  label?: string
  data: number[]
  backgroundColor?: string[]
  borderColor?: string[]
  borderWidth: number
  cutout?: string
  borderRadius?: number
  offset?: number
  hoverOffset?: number
  rotation?: number
  spacing?: number
}

export interface DatasetShape {
  labels: string[]
  datasets: Dataset[]
}

// Chart Interfaces

export interface Dataset {
  label?: string
  data: number[]
  backgroundColor?: string[]
  borderColor?: string[]
  borderWidth: number
  cutout?: string
  borderRadius?: number
  offset?: number
  hoverOffset?: number
  rotation?: number
  spacing?: number
}

export interface DatasetShape {
  labels: string[]
  datasets: Dataset[]
}

// Chart Interfaces

export interface Dataset {
  label?: string
  data: number[]
  backgroundColor?: string[]
  borderColor?: string[]
  borderWidth: number
  cutout?: string
  borderRadius?: number
  offset?: number
  hoverOffset?: number
  rotation?: number
  spacing?: number
}

export interface DatasetShape {
  labels: string[]
  datasets: Dataset[]
}
