import { Button } from 'components/common/buttons/Button'
import { Input } from 'components/common/inputs/Input'
import { Typography } from 'components/common/Typography'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React from 'react'
import { addNewItemInPortfolio } from 'redux/thunk/cryptoThunk'
import CryptoModal from './CryptoModal'
import style from './CryptoItem.module.scss'
import { notifyError, notifySuccess } from 'components/common/notifications'
import { ToastContainer, Zoom } from 'react-toastify'

const CryptoModelInput = () => {
  const dispatch = useAppDispatch()
  const { coins, currency, cryptoItemInModal } = useAppSelector(
    (state) => state.cryptoWidgetSlice,
  )
  const { status } = useAppSelector((state) => state.cryptoPortfolioSlice)
  const [amount, setAmount] = React.useState<any>('')
  const [color, setColor] = React.useState<any>('')

  const { marker, imageUrl } = cryptoItemInModal
  const userDto = {
    marker: marker,
    amount: Number(amount),
    color: color,
    imageUrl: imageUrl,
  }

  const pushNewItem = () => {
    dispatch(addNewItemInPortfolio(userDto))
    setColor('')
    setAmount('')
  }

  return (
    <CryptoModal>
      <div className=" flex  items-center gap-4">
        <img src={cryptoItemInModal.imageUrl} alt="cryptoImage" width={60} />
        <Typography
          type={'Ag-18-semibold'}
          // eslint-disable-next-line
          children={cryptoItemInModal.marker}
        ></Typography>

        <Input
          type={'number'}
          name={'amount'}
          placeholder={'amount'}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="color"
          name={'color'}
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className={style.colorInput}
        />
        <Button
          type={'button'}
          btnName={'primary'}
          label={'Add to portfolio'}
          disabled={amount.length === 0 || (color.length === 0 && true)}
          onClick={pushNewItem}
        />
      </div>
    </CryptoModal>
  )
}

export default CryptoModelInput
