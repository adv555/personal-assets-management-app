import React from 'react'
import styleList from './MoneyBoxItem.module.scss'
import { Button } from 'components/common/buttons/Button'


interface MoneyBoxItem {
  name: string
  target: number
  amount: number
  currency: string
}

export const MoneyBoxItem: React.FC<MoneyBoxItem> = ({ name, target, amount, currency }) => {
  return (
    <div className={styleList.jar}>
      <div className="text-Ag-18 font-semibold">{name}</div>
      <div className="text-Ag-14 font-semibold">Target: {target} {currency}</div>
      <div className={styleList.jar_image}>
        <div className={styleList.amount}>{amount} {currency}</div>
        <div
          className={styleList.progress}
          style={{ height: `${((amount * 100) / target) * 1.6 + 62}px` }}
        ></div>
      </div>
      <div className={styleList.navigation}>
        <Button
        type={'button'}
        btnName={'primary'}
        label={'Add income'}
          className={''}
          disabled={true}
        ></Button>
        <Button
        type={'button'}
        btnName={'primary'}
        label={'Settings'}
        className={''}
        disabled={true}
        ></Button>
      </div>
    </div>
  )
}
