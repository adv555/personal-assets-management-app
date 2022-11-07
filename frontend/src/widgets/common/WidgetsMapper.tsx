import React, { useCallback, useMemo } from 'react'
import { WidgetsEnum } from './enum/widgets.enum'
import WidgetMap from './WidgetMap'

export interface IWidgetWrapperProps {
  widgetKey: WidgetsEnum
}

export interface IWidgetMapperProps<T> {
  wrapper: React.ComponentType<T & IWidgetWrapperProps>
  widgets: Array<T & IWidgetWrapperProps>
}

export function WidgetMapper<T>({
  wrapper,
  widgets: keys,
}: IWidgetMapperProps<T>) {
  const widgets = useMemo(
    () =>
      keys.map((widgetData) => {
        const widgetDetails = WidgetMap[widgetData.widgetKey]

        const WidgetWrapper = wrapper
        const WidgetComponent = widgetDetails.component

        const WrappedWidgetComponent = () => (
          <WidgetWrapper {...widgetData}>
            <WidgetComponent />
          </WidgetWrapper>
        )

        return <WrappedWidgetComponent key={widgetData.widgetKey} />
      }),
    [keys],
  )

  return <>{widgets}</>
}
