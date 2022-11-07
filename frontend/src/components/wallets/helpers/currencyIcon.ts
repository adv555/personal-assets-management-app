import { Currencies } from 'common/enums/currency.enum'

export const currencyIcon = (walletCurrency: Currencies) => {
  switch (walletCurrency) {
    case Currencies.UAH:
      return '₴'
    case Currencies.USD:
      return '$'
    case Currencies.EUR:
      return '€'
    default:
      return ''
  }
}
