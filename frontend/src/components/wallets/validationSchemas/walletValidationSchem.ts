import * as Yup from 'yup'

export const createWalletValidateSchema = Yup.object({
  wallet_name: Yup.string()
    .min(3, 'Must be at least 3 letters')
    .max(32, 'Must be max 32 letters')
    .required('Enter your wallet name'),
})

export const updateWalletValidateSchema = Yup.object({
  wallet_name: Yup.string()
    .min(3, 'Must be at least 3 letters')
    .max(32, 'Must be max 32 letters')
    .required('Enter your wallet name'),
})
