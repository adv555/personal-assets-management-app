import { passwordRules } from 'components/registerForm/schemasAuth/ValidationSchemaAuth'
import * as yup from 'yup'

export const validationsSchemaChangePassword = yup.object().shape({
  password: yup.string().min(6).matches(passwordRules, {
    message: 'Please create a stronger password ',
  }),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Password must match')
    .required('Required'),
})

export const validationsSchemaCheckCode = yup.object().shape({
  code: yup.number().typeError('Need number').required('Required').min(6),
})

export const validationsSchemaForgotPassword = yup.object().shape({
  email: yup
    .string()
    .typeError('Need string')
    .email('Need Email')
    .required('Required'),
})
