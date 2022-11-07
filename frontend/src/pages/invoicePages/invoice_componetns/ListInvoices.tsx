import React from 'react'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import {
  fetchLoadNextPageInvoices,
  fetchRemoveInvoice,
} from 'redux/slice/invoiceServices/invoiceActions'
import DropDownActions from './DropDownActions'
import { InvoiceStatus } from './statics'
import { fetchSetPagination } from 'redux/slice/pagination/paginationActions'
import { AppRoute } from 'common/enums/app-route.enum'
import { currentImagesPath } from '../secondaryFunctions/secondaryFunctions'
import { Link } from 'react-router-dom'

function convertDate(dateString: string) {
  const date = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    hour12: true,
  }).format(new Date(dateString))
  const dateOut = date.split(',')

  return (
    <>
      {dateOut[0]}
      <p className="text-xs text-text-ultralight font-normal">
        at {dateOut[1].toLocaleUpperCase()}
      </p>
    </>
  )
}

const ClientInfo = (props: any) => {
  return (
    <>
      <img
        className="float-left mr-4 max-h-9 rounded-full"
        src={currentImagesPath(props.client.avatarPath)}
        alt={props.client.email}
      />
      {`${props.client.firstName} ${props.client.lastName}`}
    </>
  )
}

export const InvoicesList = (props: any) => {
  const dispatch = useAppDispatch()
  const invoices = useAppSelector((state) => state.invoices.invoices)
  const pagination = useAppSelector((state) => state.pagination.pagination)
  const currentUser = useAppSelector((state) => state.userProfile)
  const loader = useAppSelector((state) => state.loader)

  function removeInvoice(invoiceId: number) {
    dispatch(fetchRemoveInvoice(invoiceId))
  }

  return (
    <>
      {invoices.length !== 0 ? (
        invoices.map((invoice: any) => (
          <div
            key={invoice.id}
            className="container grid grid-cols-12 gap-4 text-left text-sm mb-4 font-medium text-text"
          >
            <div
              className={`col-span-3 mt-2 rounded-xl ${
                currentUser.email === invoice.billedTo.email
                  ? 'bg-green-ultralight'
                  : 'bg-orange-ultralight'
              }`}
            >
              <Link to={`${AppRoute.INVOICE_DETAILS}/${invoice.id}`}>
                {currentUser.email && (
                  <ClientInfo
                    client={
                      currentUser.email !== invoice.billedTo.email
                        ? invoice.billedTo
                        : invoice.createdBy
                    }
                  />
                )}
                <p className="text-xs text-text-ultralight font-normal">
                  Inv: MGL {invoice.id}
                </p>
              </Link>
            </div>
            <div className="col-span-2 mt-2">
              {convertDate(invoice.invoiceDate)}
            </div>
            <div className="col-span-2 text-text-ultralight mt-2">
              {invoice.category}
            </div>
            <div className="col-span-2 font-bold mt-2">
              ${invoice.total / 100}
            </div>
            <InvoiceStatus paid={invoice.paid} dueDate={invoice.dueDate} />
            <DropDownActions
              removeInvoice={() => removeInvoice(invoice.id)}
              invoiceId={invoice.id}
              paid={invoice.paid}
              dueDate={invoice.dueDate}
              createdByEmail={invoice.createdBy.email}
            />
          </div>
        ))
      ) : (
        <div>There are no invoices here yet</div>
      )}
      {pagination.hasNextPage && (
        <button
          disabled={loader ? true : false}
          className="container bg-green-light hover:bg-green-hover rounded-xl font-semibold text-base p-3 mt-8 mb-4"
          onClick={() => {
            const page = parseInt(pagination.page.toString()) + 1 //  otherwise, the typescript does plus as a string and does not allow it to lead to a number

            dispatch(fetchSetPagination({ ...pagination, page: page }))
            dispatch(
              fetchLoadNextPageInvoices({
                ...props.filters,
                page: page,
                take: pagination.take,
              }),
            )
          }}
        >
          Load More
        </button>
      )}
    </>
  )
}
