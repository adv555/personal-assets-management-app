import { useAppSelector } from 'hooks/useAppDispatch'
import React from 'react'
import MyCryptoItems from './MyCryptoItems'

const MyCryptoList = () => {
  const { portfolioCryptoList } = useAppSelector(
    (state) => state.cryptoPortfolioSlice,
  )

  return (
    <div>
      <table className=" table-fixed min-w-full leading-normal overflow-x-hidden mt-4">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr className="bg">
            <th className="py-3 px-6 text-left	">#</th>
            <th className="text-left	">Name</th>
            <th className="text-left	">Price in USD</th>
            <th className="text-left	">Total</th>
            <th className="text-left	">Total in USD</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {portfolioCryptoList.map((el: any, id: number) => (
            <MyCryptoItems key={id} id={id + 1} el={el} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MyCryptoList
