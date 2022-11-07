const PASSWORD_RULE = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/

const PASSWORD_UPPERCASE_RULE =
  /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/

const PASSWORD_LETTERS_RULE = /[A-Za-z]/g

const PASSWORD_NUMBERS_RULE = /[0-9]/g

const PASSWORD_SPECIAL_CHARACTERS_RULE = /[*.!@#$%^&(){}\[\]:;<>,?\/~_+=|]/g

const FILE_TYPE_RULE = /[\/.](webp|jpg|jpeg|svg|png)$/i

const PHONE_RULE = /^\+?3?8?(0\d{9})$/

const USER_NAME_RULE = /^[a-zA-ZА-ЯҐЄІЇа-яієїґ0-9\s'-]+$/

const POSITIVE_DECIMAL_NUMBER = /^(?=.*\d)\d*(?:\.\d{0,2})?$/g

const PASSWORD_RULE_MESSAGE =
  'The password must contain uppercase and lowercase letters'

const FILE_TYPE_RULE_MESSAGE =
  'The file must be in the format webp, jpg, jpeg, svg, png'

const PHONE_NUMBER_MESSAGE =
  'The phone number must be Ukrainian and in the format +380123456789'

export const REGEX = {
  PASSWORD_RULE,
  PASSWORD_LETTERS_RULE,
  PASSWORD_NUMBERS_RULE,
  PASSWORD_SPECIAL_CHARACTERS_RULE,
  PASSWORD_UPPERCASE_RULE,
  FILE_TYPE_RULE,
  PHONE_RULE,
  USER_NAME_RULE,
  POSITIVE_DECIMAL_NUMBER
}

export const MESSAGES = {
  PASSWORD_RULE_MESSAGE,
  FILE_TYPE_RULE_MESSAGE,
  PHONE_NUMBER_MESSAGE,
}
