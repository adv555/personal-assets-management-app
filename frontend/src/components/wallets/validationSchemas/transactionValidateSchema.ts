import * as Yup from 'yup'

export const createTransactionValidateSchema = Yup.object({
  name: Yup.string()
    .min(3, 'Must be at least 3 letters')
    .max(32, 'Must be max 32 letters')
    .required('Enter name'),
  sum: Yup.number(),
})

export const updateTransactionValidateSchema = Yup.object({
  name: Yup.string()
    .min(3, 'Must be at least 3 letters')
    .max(32, 'Must be max 32 letters')
    .required('Enter name'),
  sum: Yup.number(),
  createdAt: Yup.date().max(new Date(), 'Cant be future'),
})
