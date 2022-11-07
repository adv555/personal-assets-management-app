import React, { useState } from 'react'
import { useFormik } from 'formik'
import { InvoiceItemSchema } from '../schemas/invoiceItemSchema'
import { IInvoiceItem } from '../interfaces/invoiceItem.interface'

export function InputItemForm(props: {
  setItem: (arg0: IInvoiceItem) => void
}) {
  const [item, setItem] = useState({
    name: '',
    amount: 0,
    price: 0,
  })

  const formik = useFormik({
    initialValues: item,
    onSubmit: (values, { resetForm }) => {
      const subTotal = Math.round(values.price * 100) * values.amount

      props.setItem({
        ...values,
        price: Math.round(values.price * 100),
        subTotal,
        id: Date.now(),
      })
      setItem({ name: '', amount: 0, price: 0 })
      resetForm()
    },
    validationSchema: InvoiceItemSchema,
  })

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="container grid grid-cols-12 gap-4"
    >
      <input
        className={`col-span-5 border ${
          formik.touched.name && formik.errors.name
            ? 'border-error'
            : 'border-gray-medium'
        } rounded-xl p-4 focus:outline-none focus:border-green-hover focus:ring-green-hover focus:ring-0`}
        type={'text'}
        name="name"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.name}
      />
      <input
        className={`col-span-2 border ${
          formik.touched.amount && formik.errors.amount
            ? 'border-error'
            : 'border-gray-medium'
        } rounded-xl p-4 focus:outline-none focus:border-green-hover focus:ring-green-hover focus:ring-0`}
        type={'number'}
        name="amount"
        onChange={formik.handleChange}
        value={formik.values.amount > 0 ? formik.values.amount : ''}
      />
      <input
        className={`col-span-2 border ${
          formik.touched.price && formik.errors.price
            ? 'border-error'
            : 'border-gray-medium'
        } rounded-xl p-4 focus:outline-none focus:border-green-hover focus:ring-green-hover focus:ring-0`}
        type={'number'}
        name="price"
        onChange={formik.handleChange}
        value={formik.values.price > 0 ? formik.values.price : ''}
      />
      <button
        className="col-span-3 text-green-medium border border-gray-medium rounded-xl py-4 hover:bg-gray-ultralight"
        type="submit"
      >
        Add Item
      </button>
      {formik.touched.name && formik.errors.name && (
        <span className="text-error col-span-12">{formik.errors.name}</span>
      )}
      {formik.touched.amount && formik.errors.amount && (
        <span className="text-error col-span-12">{formik.errors.amount}</span>
      )}
      {formik.touched.price && formik.errors.price && (
        <span className="text-error col-span-12">{formik.errors.price}</span>
      )}
    </form>
  )
}
