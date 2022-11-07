import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { format, subDays } from 'date-fns'
import 'chartjs-adapter-date-fns'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import {
  ExchangeWidgetView,
  fetchRateHistory,
  setSelectedBank,
  setSelectedCurrency,
  setView,
} from 'redux/slice/widgets/exchangeSlice'
import HeaderButton from './HeaderButton'

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
)

const getGradient = (
  context: CanvasRenderingContext2D,
  from: string,
  to: string,
): CanvasGradient => {
  const gradient = context.createLinearGradient(0, 0, 0, context.canvas.height)

  gradient.addColorStop(0, from)
  gradient.addColorStop(1, to)

  return gradient
}

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#fff',
      titleColor: '#000',
      bodyColor: '#000',
      padding: 12,
    },
  },
  interaction: {
    intersect: false,
    mode: 'nearest' as const,
    axis: 'x' as const,
  },
  scales: {
    x: {
      type: 'time' as const,
      time: {
        tooltipFormat: 'dd.MM.yyyy',
        unit: 'day' as const,
        stepSize: 7,
        displayFormats: {
          day: 'dd.MM',
        },
      },
      suggestedMin: +subDays(new Date(), 15),
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.05)',
        lineWidth: 2,
      },
    },
  },
}

const RateHistoryView = () => {
  const chartRef = useRef<ChartJS<'line'>>(null)
  const dispatch = useAppDispatch()
  const { selectedRate, rateHistory } = useAppSelector(
    (state) => state.exchange,
  )

  useEffect(() => {
    if (selectedRate)
      dispatch(
        fetchRateHistory({
          bankId: selectedRate.bank.id,
          currencyId: selectedRate.currency.id,
        }),
      )
  }, [selectedRate])

  const data = useMemo(
    () => ({
      labels: rateHistory.map((rate) => new Date(rate.createdAt)),
      datasets: [
        {
          fill: true,
          label: 'Sell Rate',
          data: rateHistory.map((rate) => rate.sellRate ?? rate.crossRate),
          borderColor: 'rgba(39, 174, 96, 1)',
          backgroundColor: chartRef.current
            ? getGradient(
                chartRef.current.ctx,
                'rgba(39, 174, 96, 0.5)',
                'rgba(31, 41, 55, 0)',
              )
            : 'rgba(39, 174, 96, 0.5)',
        },
        {
          fill: true,
          label: 'Buy Rate',
          data: rateHistory.map((rate) => rate.buyRate ?? rate.crossRate),
          borderColor: 'rgba(174, 39, 96, 1)',
          backgroundColor: chartRef.current
            ? getGradient(
                chartRef.current.ctx,
                'rgba(174, 39, 96, 0.5)',
                'rgba(31, 41, 55, 0)',
              )
            : 'rgba(174, 39, 96, 0.5)',
        },
      ],
    }),
    [rateHistory, chartRef],
  )

  const onCurrencySelect = useCallback(() => {
    if (selectedRate) {
      dispatch(setSelectedCurrency(selectedRate.currency))
      dispatch(setView(ExchangeWidgetView.CURRENCY_RATES))
    }
  }, [selectedRate])

  const onBankSelect = useCallback(() => {
    if (selectedRate) {
      dispatch(setSelectedBank(selectedRate.bank))
      dispatch(setView(ExchangeWidgetView.BANK_RATES))
    }
  }, [selectedRate])

  return (
    <>
      <div className="flex flex-row gap-1 py-1 px-4">
        <HeaderButton onClick={() => onCurrencySelect()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </HeaderButton>
        <div className="text-Ag-14 font-medium py-1.5">
          <button
            className="uppercase underline mx-1 hover:text-green"
            type="button"
            onClick={() => onBankSelect()}
          >
            {selectedRate?.bank.name}
          </button>
          /
          <button
            className="underline mx-1 hover:text-green"
            type="button"
            onClick={() => onCurrencySelect()}
          >
            {`${selectedRate?.currency.currencyCode} (${selectedRate?.currency.currencyName})`}
          </button>
          Rates History
        </div>
      </div>
      <div className="flex flex-row items-center justify-around my-auto">
        <div className="text-h2 font-black text-gray">
          {format(new Date(selectedRate!.createdAt), 'PP:')}
        </div>
        <div className="text-h2 font-black text-green">
          {selectedRate!.sellRate}
        </div>
        <div className="text-h2 font-black text-[#AE2760]">
          {selectedRate!.buyRate}
        </div>
        <div className="text-h2 font-black text-blue">
          {selectedRate!.crossRate}
        </div>
      </div>
      <div className="p-2 my-auto">
        <Line options={options} data={data} ref={chartRef} />
      </div>
    </>
  )
}

export default RateHistoryView
