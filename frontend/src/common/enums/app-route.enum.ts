enum AppRoute {
  HOME = '/',
  SIGN_IN = 'sign-in',
  SIGN_UP = 'sign-up',
  PORTAL = 'portal',
  DASHBOARD = 'dashboard/overview/search',
  TRANSACTIONS = 'transactions',
  INVOICES = 'invoices',
  WIDGETS = 'widgets',
  MONEY_BOX = 'money-boxes',
  MY_WALLETS = 'my-wallets',
  CHATS = 'chats',
  SETTINGS = 'settings',
  INVOICE_CREATE = 'new-invoice',
  INVOICE_UPDATE = 'update-invoice',
  INVOICE_DETAILS = 'invoice-details',
  FORGOT_PASSWORD = 'forgotPassword',
  VERIFY_CODE = 'verify-code',
  CRYPTO = 'crypto',
  COIN_ID = 'all-crypto-item/:marker',
  GET_ALL_CRYPTO_ITEM = 'all-crypto-item',
}

export { AppRoute }
