import * as Yup from 'yup'

export const WalletLimitsSchema = Yup.object({
  wallet_limit: Yup.number()
    .positive('Must be positive')
    .max(100000, 'Must be 100000 characters or less')
    .required('Required'),

  wallet_duration: Yup.number()
    .positive('Must be positive')
    .max(1000, 'Must be 100000 characters or less')
    .required('Required'),
})
