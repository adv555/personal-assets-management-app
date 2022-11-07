import { ExchangeBank } from '../../exchange/bank/interfaces/bank';

export default () =>
  [
    {
      name: 'monobank',
      apiUrl: 'https://api.monobank.ua/bank/currency',
    },
    {
      name: 'privatbank',
      apiUrl: 'https://api.privatbank.ua/p24api/exchange_rates',
    },
    {
      name: 'nbu',
      apiUrl: 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange',
    },
  ] as ExchangeBank[];
