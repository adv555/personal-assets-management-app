import { Button } from 'components/common/buttons/Button'
import { Typography } from 'components/common/Typography'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React, { useEffect } from 'react'
import { changeStatusCryptoPosrtfolio } from 'redux/slice/authSlice'
import { createPortfolio } from 'redux/thunk/cryptoThunk'
import style from './CryptoDashboard.module.scss'
import photo from '../../../../assets/images/photoForCrypto.jpg'
import { AiOutlineArrowDown } from 'react-icons/ai'

const HelloPageAngCreatePortfolio = () => {
  const dispatch = useAppDispatch()
  const havePortfolio = useAppSelector(
    (state) => state.cryptoPortfolioSlice.havePortfolio,
  )

  const cerateNewPortfolio = async () => {
    await dispatch(createPortfolio())
  }

  return (
    <div className={`${style.presentPage} flex flex-col gap-5 items-center`}>
      <img
        src={photo}
        alt="photo"
        width={'60%'}
        style={{ opacity: 0.2, position: 'relative' }}
      />
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          type={'h3'}
          /* eslint-disable-next-line */
          children={
            'In this widget, you will track your cryptocurrency and their change'
          }
          className={'mt-40 mb-10'}
        />

        <Typography
          type={'h4'}
          /* eslint-disable-next-line */
          children={'You can also compare the value of cryptocurrency by price'}
          className={'m-2'}
        />
        <Typography
          type={'Ag-16-medium'}
          /* eslint-disable-next-line */
          children={
            'Click this button below and start to build your crypto portfolio'
          }
          className={'m-2'}
        />
        <AiOutlineArrowDown size={35} className={`${style.icon} m-2`} />
        <Button
          type={'button'}
          btnName={'primary'}
          label={'Create Portfolio'}
          className={'w-1/2'}
          onClick={cerateNewPortfolio}
        />
      </div>
    </div>
  )
}

export default HelloPageAngCreatePortfolio
