import { useAppSelector } from 'hooks/useAppDispatch'
import React from 'react'
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md'

export const HeaderInvoicesTable = (props: any) => {
  const loader = useAppSelector((state) => state.loader)

  const setFirstNew = () => {
    props.setFirstNew({ firstNew: !props.firstNew })
  }

  return (
    <div className="container grid grid-cols-12 gap-4 text-left text-xs mb-5 text-text-ultralight">
      <div className="col-span-3">NAME/CLIENT</div>
      <button
        disabled={loader}
        className="col-span-2"
        onClick={() => setFirstNew()}
      >
        <span className="float-left">DATE</span>
        {props.firstNew ? (
          <MdArrowDropUp size={16} />
        ) : (
          <MdArrowDropDown size={16} />
        )}
      </button>
      <div className="col-span-2">ORDERS/TYPE</div>
      <div className="col-span-2">TOTAL</div>
      <div className="col-span-2">STATUS</div>
      <div className="col-span-1">ACTION</div>
    </div>
  )
}
