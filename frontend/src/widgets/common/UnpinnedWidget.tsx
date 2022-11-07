import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch'
import React, { ReactNode, useCallback, useMemo } from 'react'
import {
  addUserWidget,
  removeUserWidget,
} from 'redux/slice/widgets/widgetsSlice'
import { Button } from 'components/common/buttons/Button'
import { Typography } from 'components/common/Typography'
import { WidgetDetailsType } from './interfaces/widgets.interface'
import { WidgetsEnum } from './enum/widgets.enum'

type UnpinnedWidgetProps = Omit<WidgetDetailsType, 'component' | 'key'> & {
  widgetKey: WidgetsEnum
  children?: ReactNode
}

const UnpinnedWidget = ({
  name,
  widgetKey,
  state,
  children,
}: UnpinnedWidgetProps) => {
  const dispatch = useAppDispatch()
  const { userWidgets } = useAppSelector((state) => state.widgets)

  const isPinnedWidget = useMemo(
    () => Boolean(~userWidgets.findIndex((o) => o.key === widgetKey)),
    [userWidgets],
  )

  const addToDashboard = useCallback(() => {
    dispatch(addUserWidget({ name, key: widgetKey, state }))
  }, [])

  const removeFromDashboard = useCallback(() => {
    dispatch(removeUserWidget(widgetKey))
  }, [])

  return (
    <div className="flex flex-col gap-2 relative w-full lg:w-1/2 xl:w-1/3">
      <div className="flex flex-row">
        <Typography type="Ag-18-semibold">{name}</Typography>
      </div>

      <div className="rounded-lg relative flex-1 max-h-[430px] min-h-[430px] overflow-hidden">
        {children}
      </div>

      <Button
        type="button"
        btnName={isPinnedWidget ? 'danger' : 'primary'}
        label={isPinnedWidget ? 'Remove from dashboard' : 'Add to dashboard'}
        className="w-auto hover:text-text mr-auto focus:text-text"
        onClick={isPinnedWidget ? removeFromDashboard : addToDashboard}
      />
    </div>
  )
}

export default UnpinnedWidget
