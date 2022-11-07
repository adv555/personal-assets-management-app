import * as Yup from 'yup'
import { REGEX } from 'shared/regexp'

export const changePasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required('Please, enter your password')
    .matches(REGEX.PASSWORD_NUMBERS_RULE, 'Password should contain numbers')
    .matches(REGEX.PASSWORD_LETTERS_RULE, 'Password should contain letters')
    .matches(
      REGEX.PASSWORD_SPECIAL_CHARACTERS_RULE,
      'Password should contain special characters',
    )
    .matches(
      REGEX.PASSWORD_UPPERCASE_RULE,
      'Password should contain uppercase and lowercase letters',
    )
    .min(8, 'Password should contain minimum 8 symbols')
    .max(64, 'Password should contain maximum 64 symbols'),

  confirmPassword: Yup.string()
    .required('Please, enter your password')
    .oneOf([Yup.ref('newPassword')], "Passwords aren't the same"),
})
