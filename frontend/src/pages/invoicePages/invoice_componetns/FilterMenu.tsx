import { Typography } from 'components/common/Typography'
import { useAppSelector } from 'hooks/useAppDispatch'
import React, { useState } from 'react'
import { MdOutlineCancel, MdOutlineFilterList } from 'react-icons/md'
import { getCorrectDateFormat } from '../secondaryFunctions/secondaryFunctions'

const resetAllFilters = {
  minDate: '',
  maxDate: '',
  minPrice: 0,
  maxPrice: 0,
  status: '',
  target: '',
}

const getCurrentLabel = (label: string) => {
  switch (label) {
    case 'toUser':
      return 'to My'
    case 'fromUser':
      return 'from My'
    case 'all':
      return 'ALL'
  }
}

function FilterMenu(props: any) {
  const [showSidebar, setShowSidebar] = useState(false)
  const loader = useAppSelector((state) => state.loader)

  return (
    <>
      {showSidebar && (
        <button
          className="flex text-4xl text-gray  hover:text-gray-dark items-center cursor-pointer absolute right-10 top-6 z-50"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <MdOutlineCancel size={20} />
        </button>
      )}

      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="border border-gray-ultralight hover:bg-gray-ultralight rounded-xl font-semibold text-base px-4 pt-4 pb-3.5 my-4 ml-4"
      >
        <div className="flex justify-center">
          <MdOutlineFilterList size={20} />
          <span className="pl-3 lg:block hidden">Filters</span>
        </div>
      </button>

      {showSidebar && (
        <div
          className={`top-0 right-0 w-min bg-gray-ultralight  p-5 pl-10 text-white absolute z-40 h-screen ease-in-out duration-300 ${
            showSidebar ? 'translate-x-0 ' : 'translate-x-full'
          }`}
        >
          <Typography className="mt-2 mb-4 text-text" type={'h1'}>
            {'Filter By'}
          </Typography>
          <div className="scroll-auto">
            <ul className="items-center w-full text-sm font-medium text-text-ultralight bg-white rounded-lg border border-gray-light sm:flex mb-4">
              {['unpaid', 'paid', 'pending'].map((statusInvoice: string) => (
                <li key={statusInvoice} className="w-full">
                  <div className="flex items-center pl-3">
                    <input
                      onChange={(e) => {
                        props.setFilters({ status: e.target.value })
                      }}
                      id={statusInvoice}
                      name="status"
                      type="radio"
                      value={statusInvoice}
                      className="w-4 h-4 text-green bg-gray-ultralight rounded-xl border-gray-light focus:ring-transparent"
                      checked={props.filters.status === statusInvoice}
                    />
                    <label
                      htmlFor={statusInvoice}
                      className="py-3 ml-2 w-full text-sm font-medium text-text"
                    >
                      {statusInvoice}
                    </label>
                  </div>
                </li>
              ))}
            </ul>

            <ul className="items-center w-full text-sm font-medium text-text bg-white rounded-lg border border-gray-light sm:flex mb-4">
              {[true, false].map((min: boolean) => (
                <li key={min ? 'minDate' : 'maxDate'} className="w-full mx-2">
                  <div className="font-medium py-3 pl-2">
                    <span className="text-text-light ml-4">
                      {min ? 'Min' : 'Max'} Date
                    </span>
                    <input
                      onChange={(e) => {
                        const currentDateValue = e.target.value
                          ? new Date(e.target.value).toISOString()
                          : ''

                        min
                          ? props.setFilters({ minDate: currentDateValue })
                          : props.setFilters({ maxDate: currentDateValue })
                      }}
                      className="w-min border border-gray-light rounded-xl p-2 focus:outline-none focus:border-green-hover focus:ring-green-hover focus:ring-0"
                      type={'datetime-local'}
                      value={
                        min
                          ? getCorrectDateFormat(props.filters.minDate)
                          : getCorrectDateFormat(props.filters.maxDate)
                      }
                    />
                  </div>
                </li>
              ))}
            </ul>

            <ul className="items-center w-full text-sm font-medium text-text bg-white rounded-lg border border-gray-light sm:flex mb-4">
              {[true, false].map((min: boolean) => (
                <li key={min ? 'minPrice' : 'maxPrice'} className="w-full mx-2">
                  <div className="font-medium py-3 pl-2">
                    <span className="text-[#78778B] ml-4">
                      {min ? 'Min' : 'Max'} Price
                    </span>
                    <input
                      onChange={(e) => {
                        min
                          ? props.setFilters({
                              minPrice: (parseFloat(e.target.value) * 100) | 0,
                            })
                          : props.setFilters({
                              maxPrice: (parseFloat(e.target.value) * 100) | 0,
                            })
                      }}
                      className="w-full border border-gray-light rounded-xl p-2 focus:outline-none focus:border-green-hover focus:ring-green-hover focus:ring-0"
                      type={'number'}
                      value={
                        min
                          ? props.filters.minPrice / 100
                          : props.filters.maxPrice / 100
                      }
                    />
                  </div>
                </li>
              ))}
            </ul>

            <ul className="items-center w-full text-sm font-medium text-text-ultralight bg-white rounded-lg border border-gray-light sm:flex mb-4">
              {['toUser', 'fromUser', 'all'].map((target: string) => (
                <li key={target} className="w-full">
                  <div className="flex items-center pl-3">
                    <input
                      onChange={(e) => {
                        props.setFilters({
                          target: target === 'all' ? '' : e.target.value,
                        })
                      }}
                      id={target}
                      name="target"
                      type="radio"
                      value={target}
                      className="w-4 h-4 text-green bg-gray-ultralight rounded-xl border-gray-light focus:ring-transparent"
                      checked={
                        props.filters.target === target
                          ? true
                          : props.filters.target === '' && target === 'all'
                      }
                    />
                    <label
                      htmlFor={target}
                      className={`my-3 rounded-xl text-center mx-2 w-full text-sm font-medium text-text 
                        ${
                          target === 'toUser'
                            ? 'bg-green-ultralight'
                            : target === 'fromUser'
                            ? 'bg-orange-ultralight'
                            : 'bg-gray-ultralight'
                        }`}
                    >
                      {getCurrentLabel(target)}
                    </label>
                  </div>
                </li>
              ))}
            </ul>

            <div>
              <button
                disabled={loader}
                onClick={() => props.getInvoicesWithFilters()}
                className="w-5/12 bg-green-light hover:bg-green-hover rounded-xl font-semibold text-base p-4 my-4 mx-3 text-text"
              >
                filter
              </button>
              <button
                disabled={loader}
                onClick={() => props.resetFilters(resetAllFilters)}
                className="w-5/12 bg-green-light hover:bg-green-hover rounded-xl font-semibold text-base p-4 my-4 mx-3 text-text"
              >
                reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default FilterMenu
