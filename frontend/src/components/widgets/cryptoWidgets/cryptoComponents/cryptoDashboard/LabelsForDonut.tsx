import { Typography } from 'components/common/Typography'
import { useAppSelector } from 'hooks/useAppDispatch'
import React from 'react'

/*eslint-disable */

export const LabelsForDonut = () => {
  const {
    color,
    priceData,
    portfolioCryptoList,
    totalBalans,
    newPriceForItems,
  } = useAppSelector((state) => state.cryptoPortfolioSlice)

  return (
    <div>
      {portfolioCryptoList.map((el: any, i: number) => (
        <div className="labels flex justify-between my-2" key={el.marker}>
          <div className="flex gap-2">
            <div
              className="w-2 h-2 rounded-full p-3"
              style={{ background: `${el.color}` }}
            ></div>
            {/* eslint-disable-next-line */}
            <Typography
              type={'Ag-16-regular'}
              children={`${el.marker}`}
            ></Typography>
          </div>
          {/* eslint-disable-next-line */}
          <Typography
            type={'h4'}
            children={`${(
              ((newPriceForItems[el.marker]['USD'] * el.amount) / totalBalans) *
              100
            ).toFixed(1)}%`}
          ></Typography>
        </div>
      ))}
    </div>
  )
}
/*eslint-enable */
