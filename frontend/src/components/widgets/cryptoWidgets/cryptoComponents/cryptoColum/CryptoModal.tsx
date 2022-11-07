import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React from 'react'
import { ToastContainer, Zoom } from 'react-toastify'
import { setModalWindow } from 'redux/slice/cryptoPortfolioSlice'
import style from './CryptoItem.module.scss'

type CryptoModal = {
  children?: any
}

const CryptoModal: React.FC<CryptoModal> = ({ children }) => {
  const dispatch = useAppDispatch()

  const { modalActive } = useAppSelector((state) => state.cryptoPortfolioSlice)

  return (
    <div>
      <div
        className={modalActive ? style.containerActive : style.containerModal}
        onClick={() => dispatch(setModalWindow())}
      >
        <div className={style.popap} onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
      {/* <ToastContainer transition={Zoom} /> */}
    </div>
  )
}

export default CryptoModal
