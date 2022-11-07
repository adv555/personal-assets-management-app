import { IInvoice } from 'redux/slice/invoiceServices/invoice.slice'
import { CONSTANTS } from '../../../shared/constants'
import profile from '../../../assets/icons/profile.svg'

export function getCorrectDateFormat(dateString: string) {
  if (!dateString) {
    return ''
  }
  const dateNow = new Date(dateString)

  return `${dateNow.getFullYear()}-${String(dateNow.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(dateNow.getDate()).padStart(2, '0')}T${String(
    dateNow.getHours(),
  ).padStart(2, '0')}:${String(dateNow.getMinutes()).padStart(2, '0')}`
}

export function convertDate(date: string) {
  const convertedDate = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
  }).format(new Date(date))

  return convertedDate
}

export function convertDateTime(dateString: string) {
  const date = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    hour12: true,
  }).format(new Date(dateString))
  const dateOut = date.split(',')

  return `${dateOut[0]} at ${dateOut[1].toLocaleUpperCase()}`
}

export const sum = (obj: any) => {
  return Object.keys(obj).reduce(
    (sum, key) => sum + (parseFloat(obj[key] || 0) * 100) / 100,
    0,
  )
}

export function currentImagesPath(path: string) {
  const currentPath = path
    ? path.includes('MyFinance')
      ? `${CONSTANTS.CLOUDINARY_FILE_STORAGE}${path}`
      : path
    : profile

  return currentPath
}

export function invoiceNotValid(invoice: IInvoice) {
  if (!invoice.billedTo || Object.keys(invoice.billedTo).length < 1) {
    return 'the customer field cannot be empty'
  }
  if (!invoice.items[0] || Object.keys(invoice.items[0]).length < 1) {
    return 'the item field cannot be empty'
  }
  if (!invoice.dueDate || !invoice.invoiceDate) {
    return 'the Invoice and Due Dates field cannot be empty'
  }
  if (new Date(invoice.invoiceDate) <= new Date()) {
    return 'invoice date must be not earlier than in 5 min'
  }

  return false
}
