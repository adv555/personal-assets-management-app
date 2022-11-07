import React, { useCallback, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import { fetchAllUsersWidgets } from 'redux/slice/widgets/widgetsSlice'
import { Button } from 'components/common/buttons/Button'
import { WidgetMapper } from './WidgetsMapper'
import PinnedWidget from './PinnedWidget'
import { ReactComponent as AddIcon } from 'assets/icons/add-icon.svg'
import { AppRoute } from 'common/enums/app-route.enum'

const WidgetsBar = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { userWidgets } = useAppSelector((state) => state.widgets)

  useEffect(() => {
    dispatch(fetchAllUsersWidgets())
  }, [])

  const toWidgets = useCallback(() => {
    navigate(`/${AppRoute.PORTAL}/${AppRoute.WIDGETS}`, { replace: true })
  }, [])

  const hasWidgets = useMemo(() => Boolean(userWidgets.length), [userWidgets])

  return (
    <div className="flex-1 flex flex-col gap-8">
      {hasWidgets ? (
        <WidgetMapper
          wrapper={PinnedWidget}
          widgets={userWidgets.map(({ name, key, state }) => ({
            widgetKey: key,
            state,
            name,
          }))}
        />
      ) : (
        <Button
          type="button"
          btnName="tertiary2"
          label="Add widget"
          icon={<AddIcon />}
          onClick={toWidgets}
        />
      )}
    </div>
  )
}

export default WidgetsBar
