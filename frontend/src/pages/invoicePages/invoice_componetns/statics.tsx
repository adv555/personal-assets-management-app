import React from 'react'
import logo from '../../../assets/images/maglo_logo_invoice.png'
import { convertDate } from '../secondaryFunctions/secondaryFunctions'

export const MagloBaner: React.FC = () => {
  return (
    <div className="grid grid-rows-1 grid-flow-col columns-2 bg-black rounded-xl text-text-white py-5">
      <div className="container">
        <img className="float-left px-5" src={logo} alt="Logo" />
        <div className="columns-1">
          <div className="font-bold text-lg">Maglo</div>
          <div className="font-light">sales@maglo.com</div>
        </div>
      </div>
      <div className="container columns-1 text-right font-medium px-5">
        <div>1333 Grey Fox Farm Road</div>
        <div>Houston, TX 77060</div>
        <div>Bloomfield Hills, Michigan(MI), 48301</div>
      </div>
    </div>
  )
}

export function HeaderItems(props: any) {
  return (
    <div className="container py-4 grid grid-cols-12 gap-4 text-text-ultralight font-semibold">
      <div className="text-left pl-4 col-span-5">NAMES</div>
      <div
        className={`text-center ${
          props.detailsPage ? 'col-span-3' : 'col-span-2'
        }`}
      >
        NUMBER OF ITEMS
      </div>
      <div className="text-center col-span-2">PRICE</div>
      <div className="text-right pr-4 col-span-2">TOTAL PRICE</div>
    </div>
  )
}

export function InvoiceInfoBaner(props: any) {
  const address = props.billedTo?.address.split(',') || ''
  const customerName = props.billedTo?.firstName
    ? `${props.billedTo.firstName} ${props.billedTo.lastName}`
    : props.billedTo?.email

  return (
    <div className="grid grid-rows-1 grid-flow-col columns-2 bg-gray-ultralight rounded-xl p-5">
      <div className="container">
        <div className="font-bold text-lg">Invoice Number</div>
        <br />
        {props.invoice.createdAt && (
          <div className="font-medium text-text-light">
            MAG {props.invoice.id}
          </div>
        )}
        <div className="font-medium text-text-light">
          Issued Date: {convertDate(props.issuedDate)}
        </div>
        <div className="font-medium text-text-light">
          Due Date:{' '}
          {props.invoice.dueDate && convertDate(props.invoice.dueDate)}
        </div>
      </div>
      <div className="container text-right">
        <div className="font-bold text-lg">Billed to</div>
        <br />
        <div className="font-medium text-text-light">{customerName}</div>
        <div className="font-medium text-text-light">
          {address && address[0]}
        </div>
        <div className="font-medium text-text-light">
          {address && `${address[1]}, ${address[2]}`}
        </div>
      </div>
    </div>
  )
}

export const InvoiceStatus = (props: { dueDate: string; paid: boolean }) => {
  const nowDate = new Date()
  const dueDate = new Date(props.dueDate)
  const status =
    nowDate < dueDate ? (
      <div className="text-orange-light bg-orange-ultralight py-2 px-4 w-max text-center rounded mb-3">
        Pending
      </div>
    ) : (
      <div className="text-error bg-error-ultralight py-2 px-4 w-max text-center rounded mb-3">
        Unpaid
      </div>
    )

  return (
    <div className="col-span-2">
      {props.paid ? (
        <div className="text-green bg-green-ultralight py-2 px-4 w-max text-center rounded mb-3">
          Paid
        </div>
      ) : (
        status
      )}
    </div>
  )
}
