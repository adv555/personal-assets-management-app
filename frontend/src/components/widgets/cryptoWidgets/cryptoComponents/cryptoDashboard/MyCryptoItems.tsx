import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { deleteCryptoItem } from 'redux/thunk/cryptoThunk'

type ItemProps = {
  el: any
  id: number
}

const MyCryptoItems: React.FC<ItemProps> = ({ el, id }) => {
  const newPriceForItems = useAppSelector(
    (state) => state.cryptoPortfolioSlice.newPriceForItems,
  )
  const dispatch = useAppDispatch()

  return (
    <tr className="w-full bg-white border-b dark:bg-gray-500 dark:border-gray-500">
      <td className="py-1 px-6">{id}</td>
      <td className="py-1 px-2">
        <img src={el.imageUrl} alt="photo" width={'30px'}></img>
        {el.marker}
      </td>
      <td>{newPriceForItems[el.marker]['USD']}</td>
      <td className="py-4 px-4">{el.amount}</td>
      <td className="py-1 px-2 ml-10">
        {(newPriceForItems[el.marker]['USD'] * el.amount).toFixed(2)}
      </td>
      <td>
        <AiOutlineDelete
          size={25}
          cursor={'pointer'}
          onClick={() => dispatch(deleteCryptoItem(Number(el.id)))}
        />
      </td>
    </tr>
  )
}

export default MyCryptoItems
