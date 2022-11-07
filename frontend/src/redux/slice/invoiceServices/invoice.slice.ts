import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IInvoiceItem } from 'pages/invoicePages/interfaces/invoiceItem.interface'
import { IUserProfile } from '../userProfile/userProfile.slice'

export interface IInvoice {
  id?: number
  billedTo: IUserProfile | undefined
  createdBy?: IUserProfile
  createdAt?: string
  updatedAt?: string
  items: IInvoiceItem[]
  discount: number
  paid?: boolean
  dueDate: string
  invoiceDate: string
  invoiceDetails: string
  total: number
  category?: string
}

const initialState: { invoices: IInvoice[] } = { invoices: [] }

export const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    initialInvoices: (state, action) => ({
      invoices: action.payload,
    }),
    updateInvoiceSuccess: (state, action: PayloadAction<IInvoice>) => ({
      invoices: [...state.invoices, action.payload],
    }),
    addNewPageOfInvoices: (state, action: PayloadAction<IInvoice[]>) => ({
      invoices: [...state.invoices, ...action.payload],
    }),
    removeInvoiceSuccess: (state, action) => {
      state.invoices = state.invoices.filter(
        (invoice) => invoice.id !== action.payload,
      )
    },
    setOneInvoice: (state, action: PayloadAction<IInvoice>) => ({
      invoices: [action.payload],
    }),
  },
})

export const {
  updateInvoiceSuccess,
  removeInvoiceSuccess,
  initialInvoices,
  addNewPageOfInvoices,
  setOneInvoice,
} = invoiceSlice.actions

export default invoiceSlice.reducer
