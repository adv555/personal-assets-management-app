import React, { useCallback, useEffect, useState } from 'react'
import { ReactComponent as CreateInvoiceIcon } from 'assets/icons/create_invoice.svg'
import FilterMenu from 'pages/invoicePages/invoice_componetns/FilterMenu'
import { AppRoute } from 'common/enums/app-route.enum'
import { fetchAllInvoices } from 'redux/slice/invoiceServices/invoiceActions'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import { InvoicesList } from './invoice_componetns/ListInvoices'
import { HeaderInvoicesTable } from './invoice_componetns/HeaderInvoicesTable'
import { SearchInvoices } from './invoice_componetns/SearchInvoices'
import { Link, useLocation, useSearchParams } from 'react-router-dom'

const getQueryParams = (currentFilters: any) => {
  return Object.keys(currentFilters)
    .map((key: string) =>
      currentFilters[key as keyof typeof currentFilters]
        ? `${key}=${currentFilters[key as keyof typeof currentFilters]}`
        : '',
    )
    .filter((param) => (param ? true : false))
}

const InvoicesListPage = () => {
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const pagination = useAppSelector((state) => state.pagination.pagination)
  const queryParamsFromUrl = new URLSearchParams(useLocation().search)
  const loader = useAppSelector((state) => state.loader)
  const [filters, setFilters] = useState({
    search: queryParamsFromUrl.get('search') || '',
    firstNew: queryParamsFromUrl.get('firstNew') ? true : false,
    minDate: queryParamsFromUrl.get('minDate') || '',
    maxDate: queryParamsFromUrl.get('maxDate') || '',
    minPrice: queryParamsFromUrl.get('minPrice') || '',
    maxPrice: queryParamsFromUrl.get('maxPrice') || '',
    status: queryParamsFromUrl.get('status') || '',
    target: queryParamsFromUrl.get('target') || '',
  })

  useEffect(() => {
    dispatch(fetchAllInvoices({ ...filters, page: 1, take: pagination.take }))
  }, [])

  const getInvoicesWithFilters = useCallback(
    (currentFilters = filters) => {
      const queryParams = getQueryParams(currentFilters)

      setSearchParams(`${queryParams.join('&')}`)
      dispatch(
        fetchAllInvoices({ ...currentFilters, page: 1, take: pagination.take }),
      )
    },
    [filters, searchParams, pagination],
  )

  const setNewFilters = useCallback(
    (newFilters: any) => {
      setFilters({ ...filters, ...newFilters })
    },
    [filters],
  )

  const setNewFiltersAndGetInvoices = useCallback(
    (newFilters: any) => {
      const currentFilters = { ...filters, ...newFilters }

      setFilters({ ...filters, ...newFilters })
      getInvoicesWithFilters(currentFilters)
    },
    [filters],
  )

  return (
    <div className="container mx-auto mb-10">
      <div className="container">
        <div className="container grid grid-cols-12 gap-4 mb-4 w-full">
          <SearchInvoices
            setSearchString={setNewFilters}
            searcheString={filters.search}
            getInvoicesWithFilters={getInvoicesWithFilters}
            setNewFiltersAndGetInvoices={setNewFiltersAndGetInvoices}
          />
          <div className="col-span-8">
            <div className="float-right">
              <button disabled={loader}>
                <Link to={AppRoute.INVOICE_CREATE}>
                  <div className="flex justify-center bg-green-light hover:bg-green-hover rounded-xl font-semibold text-base p-4 my-4">
                    <CreateInvoiceIcon className="my-auto" />
                    <span className="pl-3 lg:block hidden">Create Invoice</span>
                  </div>
                </Link>
              </button>
              <FilterMenu
                setFilters={setNewFilters}
                resetFilters={setNewFiltersAndGetInvoices}
                filters={filters}
                getInvoicesWithFilters={getInvoicesWithFilters}
              />
            </div>
          </div>
        </div>
        <HeaderInvoicesTable
          setFirstNew={setNewFiltersAndGetInvoices}
          firstNew={filters.firstNew}
        />
        <InvoicesList filters={filters} />
      </div>
    </div>
  )
}

export default InvoicesListPage
