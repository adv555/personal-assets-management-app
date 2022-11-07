import { AppRoute } from 'common/enums/app-route.enum'
import CryptoItems from 'components/widgets/cryptoWidgets/cryptoComponents/cryptoColum/CryptoItems'
import CoinById from 'components/widgets/cryptoWidgets/cryptoPage/CoinById'
import CryptoDashboard from 'components/widgets/cryptoWidgets/cryptoPage/CryptoDashboard'
import InvoiceCreatePage from 'pages/invoicePages/InvoiceCreatePage'
import InvoiceDetailPage from 'pages/invoicePages/InvoiceDetailPage'
import InvoicesListPage from 'pages/invoicePages/InvoicesListPage'
import InvoiceUpdatePage from 'pages/invoicePages/UpdateInvoicePage'
import NotFoundPage from 'pages/NotFoundPage'
import PortalPage from 'pages/PortalPage'
import {
  Chats,
  Dashboard,
  MoneyBox,
  MyWallet,
  Settings,
  Transactions,
  Widgets,
  DashboardOverview,
} from 'pages/portalPages'
import Crypto from 'pages/portalPages/Crypto'
import React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Wallet } from '../components/dashboard/interfaces'

const PortalRouts = () => {
  return (
    <Routes>
      <Route
        path={AppRoute.HOME}
        element={<Navigate to={'portal/' + AppRoute.DASHBOARD} />}
      />
      <Route path={AppRoute.PORTAL} element={<PortalPage />}>
        <Route index element={<DashboardOverview />} />
        <Route path={AppRoute.DASHBOARD} element={<DashboardOverview />} />
        <Route path={AppRoute.TRANSACTIONS} element={<Transactions />} />
        <Route path={AppRoute.INVOICES}>
          <Route path="" element={<InvoicesListPage />} />
          <Route
            path={`${AppRoute.INVOICE_CREATE}/`}
            element={<InvoiceCreatePage />}
          />
          <Route
            path={`${AppRoute.INVOICE_UPDATE}/:invoiceId`}
            element={<InvoiceUpdatePage />}
          />
          <Route
            path={`${AppRoute.INVOICE_DETAILS}/:invoiceId`}
            element={<InvoiceDetailPage />}
          />
        </Route>
        <Route path={AppRoute.MY_WALLETS} element={<MyWallet />} />
        <Route path={AppRoute.CRYPTO} element={<Crypto />}>
          <Route index element={<CryptoDashboard />} />
          <Route
            path={AppRoute.GET_ALL_CRYPTO_ITEM}
            element={<CryptoItems />}
          />
          <Route path={AppRoute.COIN_ID} element={<CoinById />} />
        </Route>
        <Route path={AppRoute.WIDGETS} element={<Widgets />} />
        <Route path={AppRoute.MONEY_BOX} element={<MoneyBox />} />
        <Route path={AppRoute.CHATS} element={<Chats />} />
        <Route path={AppRoute.SETTINGS} element={<Settings />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default PortalRouts
