import React from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { IInvoiceItem } from '../interfaces/invoiceItem.interface'

export function InvoiceItemsList(props: any) {
  return (
    <div className="font-medium mx-auto">
      {props.items.map((item: IInvoiceItem) => (
        <div key={item.id}>
          <div className="container grid grid-cols-12 gap-4">
            <div className="border border-gray-medium rounded-xl p-4 col-span-5">
              {item.name}
            </div>
            <div
              className={`text-center border border-gray-medium rounded-xl py-4 ${
                !props.removeItem ? 'col-span-3' : 'col-span-2'
              }`}
            >
              {item.amount}
            </div>
            <div className="text-center border border-gray-medium rounded-xl py-4 col-span-2">
              ${item.price / 100}
            </div>
            <div className="text-center border border-gray-medium rounded-xl p-4 col-span-2">
              ${item.subTotal / 100}
            </div>
            {props.removeItem && (
              <button
                onClick={() => props.removeItem(item, true)}
                className="col-span-1 text-text-ultralight hover:text-error px-2"
              >
                <AiOutlineDelete size={20} />
              </button>
            )}
          </div>
          <br />
        </div>
      ))}
    </div>
  )
}
