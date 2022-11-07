import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { getStatisticsOneCoin } from 'redux/thunk/cryptoThunk'
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../../hooks/useAppDispatch'
import {
  CategoryScale,
  Chart,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  LineController,
} from 'chart.js'
import { chartDays } from '../cryptoDashboard/MockDataForCryptoStatisticsButton'
import { Button } from 'components/common/buttons/Button'
import { formatRelative } from 'date-fns'

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  LineController,
)

const OneCoinInfo = ({ marker }: any) => {
  const { currency, statisticsDataForOneCoin } = useAppSelector(
    (state) => state.cryptoWidgetSlice,
  )

  const dispatch = useAppDispatch()
  const [statisticsHistoryDay, setStatisticsHistoryDay] = useState('365')

  const [days, setDays] = React.useState(1)

  React.useEffect(() => {
    dispatch(
      getStatisticsOneCoin({
        marker,
        currency,
        limitDay: statisticsHistoryDay,
      }),
    )
  }, [])

  React.useEffect(() => {
    dispatch(
      getStatisticsOneCoin({
        marker,
        currency,
        limitDay: statisticsHistoryDay,
      }),
    )
  }, [statisticsHistoryDay])

  return (
    <div>
      <Line
        data={{
          labels: statisticsDataForOneCoin.map((coin: any) => {
            const date = new Date(coin.time * 1000)

            return date.toLocaleDateString()
          }),

          datasets: [
            {
              data: statisticsDataForOneCoin.map((coin: any) => coin.close),
              label: `Price ( Past ${days} Days) in ${currency}`,

              borderColor: '#27AE60',
              tension: 0.1,
            },
          ],
        }}
        options={{
          elements: {
            point: {
              radius: 2,
            },
          },
        }}
      />
      <div className="grid grid-cols-3 gap-6">
        {chartDays.map((day) => (
          <Button
            /* eslint-disable-next-line */
            label={`${day.label}`}
            key={day.label}
            type={'button'}
            btnName={'secondary'}
            style={{ marginLeft: '10px', wigth: '80%' }}
            onClick={() => setStatisticsHistoryDay(day.value)}
          />
        ))}
      </div>
    </div>
  )
}

export default OneCoinInfo
