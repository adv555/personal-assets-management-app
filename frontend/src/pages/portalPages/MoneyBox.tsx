import React, { useCallback, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import { Button } from 'components/common/buttons/Button'
import { MoneyBoxModal } from 'components/MoneyBoxModal/MoneyBoxModal'
import { MoneyBoxItem } from 'components/MoneyBoxItem/MoneyBoxItem'
import style from '../../components/MoneyBoxModal/MoneyBoxModal.module.scss'

const MoneyBox = () => {
  const [modelOpen, setModelOpen] = useState(false)

  const { moneyBoxes} =
    useAppSelector((state) => state.moneyBoxes)
  
  const { wallets } =
    useAppSelector((state) => state.wallets)

  const toggleModalWindow = useCallback(() => {
    setModelOpen((prevState) => !prevState)
  }, [])

  return (
    <>
      <Button
        onClick={toggleModalWindow}
        type={'button'}
        btnName={'primary'}
        label={'Create MoneyBox'}
        className={'w-48'}
        disabled={wallets.length === 0 && true}
      ></Button>

      <MoneyBoxModal
        openModal={modelOpen}
        toggleModal={toggleModalWindow}
      ></MoneyBoxModal>

      <div className={style.jar_list}>
        {moneyBoxes.map((moneyBox) => (
          <MoneyBoxItem
            key={moneyBox.id}
            name={moneyBox.moneybox_name}
            target={moneyBox.target}
            amount={moneyBox.amount}
            currency={moneyBox.currency}
          ></MoneyBoxItem>
        ))}
      </div>
    </>
  )
}

export default MoneyBox