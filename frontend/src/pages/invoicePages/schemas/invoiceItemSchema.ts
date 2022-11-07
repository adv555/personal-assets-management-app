import * as Yup from 'yup'

export const InvoiceItemSchema = Yup.object({
  name: Yup.string()
    .min(3, '- name must be at least three characters')
    .max(64, '- name must be 64 characters or less')
    .required('- name required field'),

  amount: Yup.number()
    .positive('- numbers of item must be a positive number')
    .required('Required'),

  price: Yup.number()
    .positive('- price must be a positive number')
    .required('Required'),
})
