import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React, { useEffect, useMemo } from 'react'
import { fetchLists, setCursor } from 'redux/slice/todo/todo.slice'
import { BottomPanel } from './components/BottomPanel'
import { ToDoList } from './components/ToDoList'
import { TopPanel } from './components/TopPanel'
import { Dialogs } from './Dialogs'

export function ToDoWidget() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchLists())
  }, [])

  const loadingStatus = useAppSelector((state) => state.todo.status)
  const listCount = useAppSelector((state) => state.todo.lists.length)
  const cursor = useAppSelector((state) => state.todo.cursor)

  const handleDeleteShowedList = () =>
    dispatch(setCursor(cursor - 1 >= 0 ? cursor - 1 : 0))

  const outMessage = useMemo(
    () =>
      loadingStatus === 'loading'
        ? 'Please wait...'
        : 'You have no any lists to do',
    [loadingStatus],
  )

  return (
    <section
      className="rounded-lg border shadow-md flex flex-col"
      style={{ maxWidth: 500 }}
    >
      <TopPanel />
      <div style={{ minHeight: 200 }}>
        {loadingStatus === 'loading' || listCount < 1 ? (
          <div className="text-center text-gray-400">{outMessage}</div>
        ) : (
          <ToDoList onDeleteCallback={handleDeleteShowedList} />
        )}
      </div>
      <BottomPanel />
      <Dialogs />
    </section>
  )
}
