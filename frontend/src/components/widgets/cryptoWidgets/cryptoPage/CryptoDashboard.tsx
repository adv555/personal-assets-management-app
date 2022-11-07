import { AxiosError } from 'axios'
import { AppRoute } from 'common/enums/app-route.enum'
import { Button } from 'components/common/buttons/Button'
import { notifyError, notifySuccess } from 'components/common/notifications'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, Zoom } from 'react-toastify'
import { changeStatusCryptoPosrtfolioOnFalse } from 'redux/slice/authSlice'
import { chengeStatusPortfolio } from 'redux/slice/cryptoPortfolioSlice'
import { errorOccurred, resetError } from 'redux/slice/error/error.slice'
import { startLoading, stopLoading } from 'redux/slice/loader/loader.slice'
import { resetSuccess, successAction } from 'redux/slice/success/success.slice'
import { getUserSuccess } from 'redux/slice/userProfile/userProfile.slice'
import { createPortfolio } from 'redux/thunk/cryptoThunk'
import CryptoDashboardSection from '../cryptoComponents/cryptoDashboard/CryptoDashboardSection'
import Donut from '../cryptoComponents/cryptoDashboard/Donut'
import MyCryptoList from '../cryptoComponents/cryptoDashboard/MyCryptoList'
import style from './CryptoDashboard.module.scss'
import HelloPageAngCreatePortfolio from './HelloPageAngCreatePortfolio'

const CryptoDashboard = () => {
  const navidate = useNavigate()
  const dispatch = useAppDispatch()
  const hasCryptoPortfolio = useAppSelector(
    (state) => state.authSlice.hasCryptoPortfolio,
  )
  const { isAuth } = useAppSelector((state) => state.authSlice)
  const { status, havePortfolio } = useAppSelector(
    (state) => state.cryptoPortfolioSlice,
  )
  const clickGetAll = () => {
    return navidate(AppRoute.GET_ALL_CRYPTO_ITEM)
  }

  React.useEffect(() => {
    if (status === 'ERROR') {
      notifyError(`Error !!
      Restart the page and try again`)
    }
    if (status === 'SUCCSES') {
      notifySuccess('Succsesful')
    }
  }, [status])

  return (
    <>
      {hasCryptoPortfolio === true || havePortfolio === true ? (
        <div className={style.container}>
          <div>
            <Donut />
          </div>
          <div>
            <div className="grid grid-cols-3 gap-4 m-2 mb-6">
              <CryptoDashboardSection />
            </div>

            <div className="flex gap-3">
              <Button
                type={'button'}
                btnName={'primary'}
                label={'Add a new cryptocurrency'}
                className={'w-30 h-20'}
                onClick={clickGetAll}
              />
            </div>

            <MyCryptoList />
          </div>

          <ToastContainer transition={Zoom} />
        </div>
      ) : (
        <>
          <HelloPageAngCreatePortfolio />
        </>
      )}
    </>
  )
}

export default CryptoDashboard
