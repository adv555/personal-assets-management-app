import React from 'react'
import { IoMdTennisball } from 'react-icons/io'
import style from './CryptoDashboardComponent.module.scss'
import { MdOutlineAccountBalanceWallet } from 'react-icons/md'
import { FaPercent } from 'react-icons/fa'
import clsx from 'clsx'
import { useAppSelector } from 'hooks/useAppDispatch'
import { Typography } from 'components/common/Typography'

const mockData = [
  {
    title: 'Total balance',
    icon: <MdOutlineAccountBalanceWallet size={30} />,
    color: 'one',
  },
  {
    title: 'P&L',
    icon: <FaPercent size={25} />,
    color: 'two',
  },
  {
    title: 'P&L in month',
    icon: <FaPercent size={25} />,
    color: 'three',
  },
]

const CryptoDashboardSection: React.FC = () => {
  const { totalBalans, statistics } = useAppSelector(
    (state) => state.cryptoPortfolioSlice,
  )

  return (
    <>
      <div className={clsx(style.item, style['one'])}>
        <div className={style.icon}>
          <MdOutlineAccountBalanceWallet size={30} />
        </div>
        <div className={style.name}>Total balance</div>
        <div className={style.value}>$ {totalBalans.toFixed(0)}</div>
      </div>
      <div className={clsx(style.item, style['two'])}>
        <div className={style.icon}>
          <FaPercent size={25} />
        </div>
        <div className={style.name}>P&L in Day</div>
        <div className={style.value}>
          <div>
            {Number(statistics['change1day']) > 0 ? '+' : ''}
            {statistics.change1day &&
              Number(statistics['change1day']).toFixed(1)}
            %
          </div>
          <Typography
            type={'Ag-18-semibold'}
            // eslint-disable-next-line
            children={`≈  ${(
              (Number(statistics['totalPrice1Day']) / 100) *
              Number(statistics['change1day'])
            ).toFixed(1)} $`}
          />
        </div>
      </div>
      <div className={clsx(style.item, style['three'])}>
        <div className={style.icon}>
          <FaPercent size={25} />
        </div>
        <div className={style.name}>P&L in 7 Days</div>
        <div className={style.value}>
          <div>
            {Number(statistics['changes7Day']) > 0 ? '+' : ''}
            {statistics['changes7Day'] &&
              Number(statistics['changes7Day']).toFixed(1)}
            %
          </div>
          <Typography
            type={'Ag-18-semibold'}
            // eslint-disable-next-line
            children={`≈  ${(
              (Number(statistics['totalPrice7Day']) / 100) *
              Number(statistics['changes7Day'])
            ).toFixed(1)} $`}
          />
        </div>
      </div>
    </>
  )
}

export default CryptoDashboardSection
