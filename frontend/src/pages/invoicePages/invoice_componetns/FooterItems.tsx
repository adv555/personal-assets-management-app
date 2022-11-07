import React, { useState } from 'react'

export function FooterItems(props: any) {
  const [inputDiscount, setInputDiscount] = useState(
    props.invoice.discount ? true : false,
  )
  const [discount, setDiscount] = useState(props.invoice.discount)

  function sendDiscountToInvoice(value: string) {
    const valueInt = parseInt(value)
    const discount = value
      ? valueInt < 0
        ? 0
        : valueInt > 100
        ? 100
        : valueInt
      : 0

    setDiscount(discount)
    props.setDiscount(discount)
  }

  const InputDiscount = () => (
    <div className="col-span-2">
      <label className="relative block flex">
        <input
          className="border border-gray-medium w-20 rounded-xl p-2 focus:outline-none focus:border-green-hover focus:ring-green-hover focus:ring-0"
          type={'number'}
          name="discount"
          onChange={(e) => sendDiscountToInvoice(e.target.value)}
          value={discount}
        />
        <span className="absolute inset-y-0 right-6 flex items-center">%</span>
      </label>
    </div>
  )

  return (
    <div className="grid justify-items-end font-semibold text-right">
      <div>
        <div className="flex p-3">
          <div className="mr-8">Subtotal</div>
          <div className="mx-auto">${props.subTotal / 100}</div>
        </div>
        <div className="flex px-3 mb-4">
          <div className="mt-2 mr-8">Discount</div>
          {!props.setDiscount ? (
            <div className="mx-auto mt-2">{props.invoice.discount}%</div>
          ) : inputDiscount ? (
            <InputDiscount />
          ) : (
            <button
              onClick={() => setInputDiscount(true)}
              className="text-green-medium w-2/4 mx-auto mt-2"
            >
              Add
            </button>
          )}
        </div>
        <hr className="col-span-2 border-gray-border mt-2" />
        <div className="flex p-3">
          <div className="mr-14">Total</div>
          <div className="mx-auto">${props.total / 100}</div>
        </div>
      </div>
    </div>
  )
}
