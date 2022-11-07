import * as yup from 'yup'

export const passwordRules =
  /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/

export const validationsSchemaRegister = yup.object().shape({
  firstName: yup.string().typeError('Need string').required('Required'),
  lastName: yup.string().typeError('Need string').required('Required'),
  email: yup
    .string()
    .typeError('Need string')
    .email('Need Email')
    .required('Required'),
  password: yup.string().min(6).matches(passwordRules, {
    message: 'Please create a stronger password ',
  }),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Password must match')
    .required('Required'),
})

export const validationsSchemaLogin = yup.object().shape({
  email: yup
    .string()
    .typeError('Need string')
    .email('Need Email')
    .required('Required'),
  password: yup.string().min(6).required('Required'),
})
