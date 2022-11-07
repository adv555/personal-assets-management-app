import { Layout } from 'components/common/Layout/Layout'
import { notifyError, notifySuccess } from 'components/common/notifications'
import { useAppSelector } from 'hooks/useAppDispatch'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { ToastContainer, Zoom } from 'react-toastify'
import SliderLogin from '../../components/slider/SliderLogin/SliderLogin'

const LoginPage = () => {
  const [togglePage, setTogglePage] = React.useState<boolean>(true)
  const { status, messageError, messageSuccess } = useAppSelector(
    (state) => state.authSlice,
  )
  const { statusRefreshSlice, messageErrorRefreshSlice } = useAppSelector(
    (state) => state.refreshPasswordSlice,
  )

  const toggleFunction: () => void = () => {
    setTogglePage(!togglePage)
  }

  React.useEffect(() => {
    if (status === 'ERROR') {
      notifyError(messageError)
    }
    if (status === 'SUCCESS') {
      notifySuccess(messageSuccess)
    }
  }, [status])

  React.useEffect(() => {
    if (statusRefreshSlice === 'ERROR') {
      notifyError(messageErrorRefreshSlice)
    }
    if (statusRefreshSlice === 'SUCCESS') {
      notifySuccess(messageSuccess)
    }
  }, [statusRefreshSlice])

  return (
    <div className="grid grid-cols-1 h-full md:grid-cols-2">
      <div className="flex items-center justify-center bg-green-light">
        <div className="w-full">
          <SliderLogin />
          <ToastContainer transition={Zoom} />
        </div>
      </div>
      <div style={{ margin: 'auto', width: '100%' }}>
        <Layout>
          <Outlet />
        </Layout>
      </div>
    </div>
  )
}

export default LoginPage
