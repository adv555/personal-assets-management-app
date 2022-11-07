import { Checkbox } from '@mui/material'
import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import { createTaskSelector, updateTask } from 'redux/slice/todo/todo.slice'
import { TaskSettings } from './TaskSettings'
import 'widgets/todo/styles/todo.css'
import { colors } from 'widgets/todo/styles/colors'
import { ReactComponent as GoalIcon } from 'assets/icons/business-goal-profit.svg'

interface ToDoItemProps {
  id: number
}

export function ToDoItem(props: ToDoItemProps) {
  const dispatch = useAppDispatch()

  const labelId = 'toDoItem' + props.id
  const task = useAppSelector(createTaskSelector(props.id))

  const [descriptionPaperOpen, setDescriptionPaperOpen] = useState(false)

  if (!task) throw new Error('Task not found')
  const handleClick = () => {
    if (task.goals && task.goals?.length > 0) return
    dispatch(
      updateTask({
        id: props.id,
        description: task.description,
        isDone: true,
      }),
    )
  }

  return (
    <li
      style={{ backgroundColor: task.isDone ? colors.lightGray : 'white' }}
      className="rounded-md shadow p-3 mb-2"
    >
      <div className="flex items-center">
        <label
          onClick={handleClick}
          className="flex-1 task-label"
          style={{
            color: task.isDone ? colors.gray : 'inherit',
            textDecoration: task.isDone ? 'line-through' : 'none',
          }}
          onMouseEnter={() => setDescriptionPaperOpen(true)}
          onMouseLeave={() => setDescriptionPaperOpen(false)}
        >
          <Checkbox
            edge="start"
            checked={task.isDone}
            tabIndex={-1}
            disableRipple
            inputProps={{ 'aria-labelledby': labelId }}
          />
          {task.description}
        </label>
        {task.goals && task.goals.length > 0 ? (
          <GoalIcon
            width={16}
            height={16}
            fill={colors.green}
            style={{ marginRight: 8 }}
          />
        ) : null}
        <TaskSettings taskId={props.id} />
      </div>
      {task.goals && task.goals.length > 0 ? (
        <div
          className="top-0 right-0 left-0 bg-green-200 p-4 z-50"
          style={{ display: descriptionPaperOpen ? 'block' : 'none' }}
        >
          Goals:{' '}
          {task.goals.map((g) => (
            <p key={g.id}>{g.description}</p>
          ))}
        </div>
      ) : null}
    </li>
  )
}
