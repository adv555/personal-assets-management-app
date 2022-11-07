import { WidgetDetailsType } from './interfaces/widgets.interface'
import { WidgetsEnum } from './enum/widgets.enum'
import React, { ReactNode, useCallback, useMemo, useRef } from 'react'
import { Typography } from 'components/common/Typography'
import { ReactComponent as CloseIcon } from 'assets/icons/close.svg'
import clsx from 'clsx'
import useDropdown from '../../hooks/useDropdown'
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch'
import {
  addUserWidget,
  removeUserWidget,
} from '../../redux/slice/widgets/widgetsSlice'

type PinnedWidgetProps = Omit<WidgetDetailsType, 'component' | 'key'> & {
  widgetKey: WidgetsEnum
  children?: ReactNode
}

const PinnedWidget = ({
  name,
  widgetKey,
  state,
  children,
}: PinnedWidgetProps) => {
  const dispatch = useAppDispatch()
  const { userWidgets } = useAppSelector((state) => state.widgets)

  const removeFromDashboard = useCallback(() => {
    dispatch(removeUserWidget(widgetKey))
  }, [])

  return (
    <div className="flex flex-col gap-2 relative group">
      <div className="flex flex-row px-4 items-center">
        <Typography type="Ag-18-semibold">{name}</Typography>
        <button
          type="button"
          className="p-1 ml-auto transition duration-200 opacity-0 text-gray-500 hover:text-rose-500 group-hover:opacity-100"
          onClick={removeFromDashboard}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </button>
      </div>
      <div className="rounded-lg relative min-h-[380px] overflow-hidden shadow">
        {children}
      </div>
    </div>
  )
}

export default PinnedWidget
