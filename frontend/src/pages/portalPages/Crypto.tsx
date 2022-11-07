// import CryptoItems from 'components/widgets/cryptoWidgets/cryptoComponents/cryptoColum/CryptoItems'
import { Layout } from 'components/common/Layout/Layout'
import CryptoDashboard from 'components/widgets/cryptoWidgets/cryptoPage/CryptoDashboard'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { ToastContainer, Zoom } from 'react-toastify'

const Crypto = () => {
  return (
    <div>
      {/* <CryptoItems /> */}
      <Outlet />
    </div>
  )
}

export default Crypto
