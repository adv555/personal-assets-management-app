import * as Yup from 'yup'
import { REGEX } from 'shared/regexp'

export const PersonalInfoSchema = Yup.object({
  firstName: Yup.string()
    .max(64, 'Must be 64 characters or less')
    .matches(
      REGEX.USER_NAME_RULE,
      ' not allowed special symbols except space and dash ',
    )
    .required('Required'),

  lastName: Yup.string()
    .max(64, 'Must be 64 characters or less')
    .matches(
      REGEX.USER_NAME_RULE,
      ' not allowed special symbols except space and dash ',
    )
    .required('Required'),

  email: Yup.string()
    .required('Email cannot be empty')
    .email()
    .max(320, 'Email must be less than 320 characters.'),

  address: Yup.string()
    .max(256, 'Must be 256 characters or less')
    .notOneOf(['<', '>']),

  birthdate: Yup.date()
    .min(new Date().getFullYear() - 122, 'You are too old')
    .max(new Date().getFullYear() - 18, 'You must be at least 18 years old'),

  phone: Yup.string().matches(REGEX.PHONE_RULE, 'Phone number is not valid'),
})
