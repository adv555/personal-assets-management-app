import * as Yup from 'yup'
import { REGEX } from 'shared/regexp'

export const InputUserSchema = Yup.object({
  email: Yup.string()
    .email()
    .max(320, 'Email must be less than 320 characters.'),

  phone: Yup.string().matches(REGEX.PHONE_RULE, 'Phone number is not valid'),
})
