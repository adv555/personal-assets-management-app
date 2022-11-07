import React from 'react'
import { Chart, ArcElement } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { Typography } from 'components/common/Typography'
import { LabelsForDonut } from './LabelsForDonut'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import { getPortfolio } from 'redux/thunk/cryptoThunk'
import style from './CryptoDashboardComponent.module.scss'

Chart.register(ArcElement)

const test = [
  {
    type: 'bth',
    color: 'red',
    percent: 45,
  },
  {
    type: 'htc',
    color: 'yellow',
    percent: 25,
  },
  {
    type: 'ton',
    color: 'lightblue',
    percent: 30,
  },
]

function sortYear(a: any, b: any) {
  if (a.percent > b.percent) return -1
  if (a.percent < b.percent) return 1

  return 0
}

test.sort(sortYear)

const color = test.map((el) => el.color)
const data: number[] = test.map((el) => el.percent)

const Donut = () => {
  const dispatch = useAppDispatch()
  const {
    color,
    priceData,
    portfolioCryptoList,
    totalBalans,
    newPriceForItems,
  } = useAppSelector((state) => state.cryptoPortfolioSlice)

  React.useEffect(() => {
    dispatch(getPortfolio())
  }, [])

  const cofig = {
    data: {
      datasets: [
        {
          data: priceData.length !== 0 ? priceData : [1],
          backgroundColor: color.length !== 0 ? color : 'green',
          hoverOffset: 4,
          borderRadius: 10,
          spacing: 1,
          weight: 1,
        },
      ],
    },
    options: {
      cutout: 90,
    },
  }

  return (
    <div className="flex justify-center bg-gray-100 rounded-xl m-2 p-2">
      <div className={style.donutSection}>
        <div className={`${style.donut}`}>
          <Doughnut {...cofig}></Doughnut>
        </div>
        <div className="flex flex-col py-10 gap-4">
          <LabelsForDonut />
        </div>
      </div>
    </div>
  )
}

export default Donut
