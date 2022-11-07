import * as React from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

import { DatasetShape, Transaction } from '../interfaces'
import { colorsIncome, colorsOutcome, borderColors } from './chartColors'

ChartJS.register(ArcElement, Tooltip, Legend)

// interface PickedChartItem {
//   category: string
//   sum: number
//   percent?: number
// }

const Chart = ({ transactions }: { transactions: Transaction[] }) => {
  // This feature in progress
  // const [pickedIncome, setPickedIncome] = React.useState<>({})

  const incomeChartRef = React.useRef(null)
  const outcomeChartRef = React.useRef(null)

  const incomeLabels: string[] = []
  const incomeData: number[] = []
  const outcomeLabels: string[] = []
  const outcomeData: number[] = []

  transactions?.forEach((tr) => {
    return tr.isIncome
      ? incomeLabels.push(tr.category) && incomeData.push(tr.sum / 100)
      : outcomeLabels.push(tr.category) && outcomeData.push(tr.sum / 100)
  })

  const incomesForChart: DatasetShape = {
    labels: incomeLabels,
    datasets: [
      {
        label: 'income',
        data: incomeData,
        backgroundColor: colorsIncome,
        borderWidth: 2,
        borderColor: borderColors,
        cutout: '5%',
        borderRadius: 9,
        offset: 10,
        hoverOffset: 2,
        rotation: 15,
        spacing: 2,
      },
    ],
  }
  const outcomesForChart: DatasetShape = {
    labels: outcomeLabels,
    datasets: [
      {
        label: 'outcome',
        data: outcomeData,
        backgroundColor: colorsOutcome,
        borderWidth: 1,
        borderColor: borderColors,
        cutout: '5%',
        borderRadius: 9,
        offset: 10,
        hoverOffset: -2,
        rotation: 15,
        spacing: 2,
      },
    ],
  }

  const options = {
    aspectRatio: 1.5,
    // maintainAspectRatio: false,
    responsive: true,
    plugins: { legend: { display: true } },
  }

  return (
    <div className="p-1 flex-1">
      <h3 className="text-center p-2">Incomes and Outcomes</h3>
      <div className="w-full h-full py-2 flex justify-between gap-1 sm:items-center md:items-stretch xl:items-stretch sm:flex-col md:flex-col xl:flex-row">
        <div className="sm:basis-11/12 md:basis-11/12 xl:basis-1/2 flex-1 p-2 border">
          {incomesForChart.labels.length ? (
            <Pie
              data-chart-name="income"
              datasetIdKey="income"
              data={incomesForChart}
              options={options}
              ref={incomeChartRef}
            />
          ) : (
            <p className="text-center text-Ag-16 py-4 text-red-400">
              No transactions for the Period
            </p>
          )}
        </div>
        <div className="sm:basis-11/12 md:basis-11/12 xl:basis-1/2 flex-1  p-2 border">
          {outcomesForChart.labels.length ? (
            <Pie
              data-chart-name="outcome"
              datasetIdKey="outcome"
              data={outcomesForChart}
              options={options}
              ref={outcomeChartRef}
            />
          ) : (
            <p className="text-center text-Ag-16 py-4 text-red-400">
              No transactions for the Period
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Chart
