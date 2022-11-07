import { AppRoute } from 'common/enums/app-route.enum'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React, { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchGetInvoiceById } from 'redux/slice/invoiceServices/invoiceActions'
import { BasicInfo } from './invoice_componetns/BasicInfo'
import { ClientDetails } from './invoice_componetns/ClientDetails'
import { FooterItems } from './invoice_componetns/FooterItems'
import { InvoiceItemsList } from './invoice_componetns/InvoiceItemsList'
import {
  HeaderItems,
  InvoiceInfoBaner,
  MagloBaner,
} from './invoice_componetns/statics'
import { sum } from './secondaryFunctions/secondaryFunctions'
import { useReactToPrint } from 'react-to-print'

const InvoiceDetailPage = () => {
  const dispatch = useAppDispatch()
  const { invoiceId } = useParams()
  const error = useAppSelector((state) => state.error.message)
  const invoice = useAppSelector((state) => state.invoices.invoices[0])
  const subTotal = invoice
    ? sum(invoice.items?.map((item: any) => item.subTotal))
    : 0
  const navigate = useNavigate()
  const currentUser = useAppSelector((state) => state.userProfile)
  const componentRef = useRef(null)

  useEffect(() => {
    if (error === 'Invoice does not found for user') {
      navigate(`/${AppRoute.PORTAL}/${AppRoute.INVOICES}`)
    }
  }, [error])

  useEffect(() => {
    dispatch(fetchGetInvoiceById(`${invoiceId}`, false))
  }, [])

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Maglo Invoice',
  })

  return (
    <div className="container mx-auto">
      {invoice?.id == invoiceId && (
        <div className="container py-4 grid grid-cols-1 lg:grid-cols-10 gap-4">
          <div
            ref={componentRef}
            className="container col-span-1 lg:col-span-7 md:col-span-7 px-10"
          >
            <MagloBaner />
            <br />
            <InvoiceInfoBaner
              invoice={invoice}
              issuedDate={invoice.createdAt}
              billedTo={invoice.billedTo}
            />
            <br />
            <div>
              {invoice.invoiceDetails && (
                <>
                  <div className="text-base font-bold mb-3.5">Item Details</div>
                  <div className="w-full">{invoice.invoiceDetails}</div>
                </>
              )}
              <br />
              <br />
              <div className="w-full">
                <HeaderItems detailsPage={true} />
                <br />
                {Object.keys(invoice.items[0]).length > 0 && (
                  <InvoiceItemsList removeItem={false} items={invoice.items} />
                )}
              </div>
              <br />
              <FooterItems
                invoice={invoice}
                subTotal={subTotal}
                total={invoice.total}
              />
            </div>
          </div>
          <div className="container lg:col-span-3 col-span-1">
            {currentUser.email && invoice.billedTo && (
              <ClientDetails
                client={
                  currentUser.email !== invoice.billedTo.email
                    ? invoice.billedTo
                    : invoice.createdBy
                }
              />
            )}
            <br />
            <BasicInfo
              printPdf={handlePrint}
              invoice={invoice}
              date={{
                dueDate: invoice.dueDate,
                invoiceDate: invoice.invoiceDate,
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default InvoiceDetailPage
