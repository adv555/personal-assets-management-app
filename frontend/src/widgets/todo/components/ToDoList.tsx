import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React from 'react'
import { TaskListState } from 'redux/slice/todo/todo.slice'
import { ToDoItem } from './ToDoItem'
import Button from '@mui/material/Button'
import { deleteTaskList } from 'redux/slice/todo/todo.slice'
import { colors } from 'widgets/todo/styles/colors'

interface ToDoListProps {
  onDeleteCallback?(): void
}

export function ToDoList(props: ToDoListProps) {
  const dispatch = useAppDispatch()
  const list = useAppSelector(
    (state) => state.todo.lists[state.todo.cursor],
  ) as TaskListState

  const deleteShowedList = () => {
    props.onDeleteCallback && props.onDeleteCallback()
    dispatch(deleteTaskList(list.id))
  }

  return !list ? null : (
    <div>
      <div className="flex items-center justify-between py-2 px-6">
        <h5
          className="text-h5 font-bold uppercase text-center"
          style={{ color: colors.gray }}
        >
          {list.title}
        </h5>
        <Button
          onClick={deleteShowedList}
          sx={{ color: colors.red, textTransform: 'capitalize', padding: 0.1 }}
        >
          delete list
        </Button>
      </div>
      <ul
        style={{ minHeight: 200, overflowY: 'auto', height: 20 }}
        className="px-6"
      >
        {list.tasks.map((t) => (
          <ToDoItem key={t.id} id={t.id} />
        ))}
      </ul>
    </div>
  )
}
