import { AppRoute } from 'common/enums/app-route.enum'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactTextareaAutosize from 'react-textarea-autosize'
import { errorOccurred } from 'redux/slice/error/error.slice'
import {
  fetchGetInvoiceById,
  fetchUpdateInvoice,
} from 'redux/slice/invoiceServices/invoiceActions'
import { BasicInfo } from './invoice_componetns/BasicInfo'
import { ClientDetails } from './invoice_componetns/ClientDetails'
import { FooterItems } from './invoice_componetns/FooterItems'
import { InputItemForm } from './invoice_componetns/InputItemForm'
import { InvoiceItemsList } from './invoice_componetns/InvoiceItemsList'
import {
  HeaderItems,
  InvoiceInfoBaner,
  MagloBaner,
} from './invoice_componetns/statics'
import { sum, invoiceNotValid } from './secondaryFunctions/secondaryFunctions'

const InvoiceUpdatePage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { invoiceId } = useParams()
  const error = useAppSelector((state) => state.error.message)
  const success = useAppSelector((state) => state.success.message)
  const currentInvoice = useAppSelector((state) => state.invoices.invoices[0])
  const [invoice, setInvoice] = useState(currentInvoice)
  const [subTotal, setSubTotal] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchGetInvoiceById(`${invoiceId}`, true))
  }, [])

  useEffect(() => {
    if (success === 'Invoice loaded successfully') {
      setInvoice({
        ...currentInvoice,
        items: currentInvoice.items.map(
          ({ createdAt, updatedAt, ...item }: any) => item,
        ),
      })
      setSubTotal(sum(currentInvoice.items.map((item: any) => item.subTotal)))
    }
    if (success === 'Invoice updated successfully') {
      navigate(
        `/${AppRoute.PORTAL}/${AppRoute.INVOICES}/${AppRoute.INVOICE_DETAILS}/${invoice.id}`,
      )
    }
    if (error === 'Invoice does not found for user') {
      navigate(
        `/${AppRoute.PORTAL}/${AppRoute.INVOICES}/${AppRoute.INVOICE_DETAILS}/${invoiceId}`,
      )
    }
  }, [success, error])

  const setNewItem = useCallback(
    (
      newItem: {
        subTotal: number
        id: number
        name: string
        amount: number
        price: number
      },
      remove = false,
    ) => {
      const newItems = remove
        ? invoice.items.filter((item: any) => newItem.id !== item.id)
        : [...invoice.items, newItem]
      const sumSubTotal = sum(newItems.map((item: any) => item.subTotal)) | 0
      const total =
        Math.round((sumSubTotal * (100 - invoice.discount)) / 100) | 0

      setSubTotal(sumSubTotal)
      setInvoice({
        ...invoice,
        items: newItems.length > 0 ? newItems : [],
        total: total,
      })
    },
    [subTotal, invoice],
  )

  const sendInvoice = useCallback(() => {
    if (invoiceId && invoice.id === parseInt(invoiceId)) {
      const items = invoice.items.map(({ id, ...item }: any) => item)
      const newInvoice = { ...invoice, items }
      const messageValidation = invoiceNotValid(newInvoice)

      if (!messageValidation) {
        dispatch(fetchUpdateInvoice(invoiceId, newInvoice))
      } else {
        dispatch(errorOccurred({ statusCode: 400, message: messageValidation }))
      }
    }
  }, [invoice])

  const setDiscount = useCallback(
    (discount: number) => {
      const total = Math.round((subTotal * (100 - discount)) / 100)

      setInvoice({ ...invoice, total: total, discount: discount })
    },
    [invoice],
  )

  return (
    <div className="container mx-auto mb-10">
      <div className="container py-4 grid grid-cols-1 lg:grid-cols-10 gap-4">
        {invoice?.id == invoiceId && (
          <>
            <div className="container col-span-1 lg:col-span-7 md:col-span-7 px-10">
              <MagloBaner />
              <br />
              <InvoiceInfoBaner
                invoice={invoice}
                billedTo={invoice.billedTo}
                issuedDate={invoice.createdAt}
              />
              <br />
              <div>
                <div className="text-base font-bold mb-3.5">Item Details</div>
                <ReactTextareaAutosize
                  className="w-full border-none rounded-xl focus:outline-none focus:border-green-hover focus:ring-green-hover focus:ring-1"
                  name="detail"
                  placeholder="Details item with more info"
                  onChange={(e) =>
                    setInvoice({ ...invoice, invoiceDetails: e.target.value })
                  }
                  value={invoice.invoiceDetails}
                  maxLength={500}
                />
                <br />
                <br />
                <div className="w-full">
                  <HeaderItems />
                  <br />
                  {invoice.items.length > 0 && (
                    <InvoiceItemsList
                      items={invoice.items}
                      removeItem={(item: any) => setNewItem(item, true)}
                    />
                  )}
                </div>
                <br />
                <InputItemForm setItem={(item: any) => setNewItem(item)} />
                <br />
                <FooterItems
                  invoice={invoice}
                  subTotal={subTotal}
                  total={invoice.total}
                  setDiscount={(discount: number) => setDiscount(discount)}
                />
              </div>
            </div>
            <div className="container lg:col-span-3 col-span-1">
              <ClientDetails
                client={invoice.billedTo}
                setCustomer={(customer: any) =>
                  setInvoice({ ...invoice, billedTo: customer })
                }
              />
              <br />
              <BasicInfo
                setDate={(date: { invoiceDate: string; dueDate: string }) =>
                  setInvoice({ ...invoice, ...date })
                }
                sendInvoice={sendInvoice}
                date={{
                  dueDate: invoice.dueDate,
                  invoiceDate: invoice.invoiceDate,
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default InvoiceUpdatePage
