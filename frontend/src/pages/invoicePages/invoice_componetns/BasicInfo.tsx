import { AppRoute } from 'common/enums/app-route.enum'
import { useAppSelector } from 'hooks/useAppDispatch'
import React from 'react'
import {
  convertDateTime,
  getCorrectDateFormat,
} from '../secondaryFunctions/secondaryFunctions'
import { addMinutes, addMonths } from 'date-fns'
import { Link } from 'react-router-dom'

const minInputDate = addMinutes(new Date(), 30).toISOString()
const maxInputDate = addMonths(new Date(), 2).toISOString()

const valideteDueDate = (newDate: string, minDate: string) => {
  const minDateString = addMinutes(
    new Date(minDate || new Date()),
    60,
  ).toISOString()
  const newDueDate = new Date(newDate)

  return newDueDate >= new Date(minDateString)
    ? newDueDate.toISOString()
    : minDateString
}

const valideteInvoiceDate = (newDate: string) => {
  const newInvoiceDate = new Date(newDate)

  return newInvoiceDate >= new Date(minInputDate)
    ? newInvoiceDate.toISOString()
    : minInputDate
}

export function BasicInfo(props: any) {
  const currentUser = useAppSelector((state) => state.userProfile)
  const loader = useAppSelector((state) => state.loader)

  return (
    <div className="container h-max bg-text-white border border-gray-medium rounded-xl">
      <div className="container text-base font-semibold p-5">Basic Info</div>
      <div className="columns-1 px-5">
        <div className="font-medium pb-4">
          <span className="text-text-light">Invoice Date</span>
          {props.invoice ? (
            <div className="w-full border border-gray-medium rounded-xl p-3.5">
              {convertDateTime(props.invoice.invoiceDate)}
            </div>
          ) : (
            <input
              name="invoice-date"
              className="w-full p-3.5 border border-gray-medium rounded-xl focus:outline-none focus:border-green-hover focus:ring-green-hover focus:ring-0"
              type={'datetime-local'}
              min={getCorrectDateFormat(minInputDate)}
              max={getCorrectDateFormat(maxInputDate)}
              value={getCorrectDateFormat(props.date.invoiceDate)}
              onChange={(e) =>
                props.setDate({
                  invoiceDate: valideteInvoiceDate(e.target.value),
                  dueDate: '',
                })
              }
            />
          )}
        </div>
        <div className="font-medium pb-4 mb-4">
          <span className="text-text-light">Due Date</span>
          {props.invoice ? (
            <div className="w-full border border-gray-medium rounded-xl p-3.5">
              {convertDateTime(props.invoice.dueDate)}
            </div>
          ) : (
            <input
              name="due-date"
              className="w-full p-3.5 border border-gray-medium rounded-xl focus:outline-none focus:border-green-hover focus:ring-green-hover focus:ring-0"
              type={'datetime-local'}
              min={getCorrectDateFormat(props.date.invoiceDate)}
              max={getCorrectDateFormat(maxInputDate)}
              value={
                props.date.dueDate
                  ? getCorrectDateFormat(props.date.dueDate)
                  : props.date.dueDate
              }
              onChange={(e) =>
                props.setDate({
                  dueDate: valideteDueDate(
                    e.target.value,
                    props.date.invoiceDate,
                  ),
                })
              }
            />
          )}
        </div>
        {props.invoice ? (
          props.invoice.createdBy.email === currentUser.email &&
          !props.invoice.paid && (
            <Link
              to={`/${AppRoute.PORTAL}/${AppRoute.INVOICES}/${AppRoute.INVOICE_UPDATE}/${props.invoice.id}`}
            >
              <div className="bg-green-light rounded-xl w-full font-semibold text-base py-4 my-4 hover:bg-green-hover text-center">
                Update Invoice
              </div>
            </Link>
          )
        ) : (
          <button
            disabled={loader}
            onClick={props.sendInvoice}
            className="bg-green-light rounded-xl w-full font-semibold text-base py-4 my-4 hover:bg-green-hover"
          >
            Send Invoice
          </button>
        )}
        {props.printPdf && (
          <button
            onClick={props.printPdf}
            className="bg-gray-ultralight hover:bg-gray-border rounded-xl w-full font-semibold text-base text-green-medium py-4 my-4"
          >
            Download
          </button>
        )}
      </div>
      <br />
    </div>
  )
}
