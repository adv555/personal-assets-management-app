import React, { useEffect } from 'react'
import { useAppDispatch } from 'hooks/useAppDispatch'
import { fetchAllUsersWidgets } from 'redux/slice/widgets/widgetsSlice'
import { WidgetMapper } from './WidgetsMapper'
import { WidgetsEnumKeys } from './enum/widgets.enum'
import UnpinnedWidget from './UnpinnedWidget'
import WidgetMap from './WidgetMap'

const WidgetTiles = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchAllUsersWidgets())
  }, [])

  return (
    <div className="flex flex-row gap-4 flex-wrap">
      <WidgetMapper
        wrapper={UnpinnedWidget}
        widgets={WidgetsEnumKeys.map((key) => {
          return {
            name: WidgetMap[key].name,
            widgetKey: WidgetMap[key].key,
            state: WidgetMap[key].state,
          }
        })}
      />
    </div>
  )
}

export default WidgetTiles
