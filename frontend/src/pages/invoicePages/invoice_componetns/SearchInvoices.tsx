import { useAppSelector } from 'hooks/useAppDispatch'
import React from 'react'
import { MdOutlineCancel } from 'react-icons/md'
import { RiSearchLine } from 'react-icons/ri'

export const SearchInvoices = (props: any) => {
  const loader = useAppSelector((state) => state.loader)

  const searchInvoices = (event: any) => {
    event.preventDefault()
    props.setNewFiltersAndGetInvoices({ search: event.target.value })
  }

  return (
    <form className="col-span-4">
      <label className="relative block flex my-4 w-min font-light">
        <button
          disabled={loader}
          onClick={() => props.getInvoicesWithFilters()}
        >
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 hover:text-green">
            <RiSearchLine />
          </span>
        </button>
        <input
          onChange={(e) => props.setSearchString({ search: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') searchInvoices(e)
          }}
          className="block bg-gray-medium w-56 border border-none rounded-2xl py-4 px-9 shadow-sm focus:outline-none focus:border-green-hover focus:ring-green-hover focus:ring-1 sm:text-sm"
          placeholder="Search invoices"
          type="text"
          name="searchInvoice"
          value={props.searcheString}
        />
        <button
          disabled={loader}
          onClick={() => props.setNewFiltersAndGetInvoices({ search: '' })}
        >
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 hover:text-error">
            <MdOutlineCancel />
          </span>
        </button>
      </label>
    </form>
  )
}
