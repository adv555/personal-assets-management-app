import { createSlice } from '@reduxjs/toolkit'

export interface IPagination {
  page: number
  take: number
  itemCount: number
  pageCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

const initialState: { pagination: IPagination } = {
  pagination: {
    page: 1,
    take: 10,
    itemCount: 0,
    pageCount: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  },
}

export const paginationSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    setPagination: (state, action) => ({
      pagination: action.payload,
    }),
  },
})

export const { setPagination } = paginationSlice.actions

export default paginationSlice.reducer
