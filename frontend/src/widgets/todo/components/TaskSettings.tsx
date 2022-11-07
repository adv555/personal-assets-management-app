import { ClickAwayListener } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React, { useState } from 'react'
import {
  createTaskSelector,
  deleteTask,
  toggleAddGoalDialogForTask,
} from 'redux/slice/todo/todo.slice'
import 'widgets/todo/styles/todo.css'
import { ReactComponent as MenuDots } from 'assets/icons/menu-dots.svg'
import { colors } from '../styles/colors'

interface SettingsProps {
  taskId: number
}

export function TaskSettings(props: SettingsProps) {
  const dispatch = useAppDispatch()
  const task = useAppSelector(createTaskSelector(props.taskId))

  const [settingsOpen, setSettingsOpen] = useState(false)
  const openSettings = () => setSettingsOpen(true)
  const closeSettings = () => setSettingsOpen(false)

  const handleDelete = () => {
    closeSettings()
    dispatch(deleteTask(props.taskId))
  }

  const openAddGoalDialog = () => {
    closeSettings()
    dispatch(toggleAddGoalDialogForTask({ taskId: props.taskId, open: true }))
  }

  return (
    <div className="relative">
      <button onClick={openSettings}>
        <MenuDots fill={colors.gray} width="15px" />
      </button>
      {settingsOpen ? (
        <ClickAwayListener onClickAway={closeSettings}>
          <div
            className="absolute rounded bg-slate-50 shadow z-40 right-0 top-0"
            style={{ minWidth: 200 }}
          >
            {task?.isDone ? null : (
              <button
                type="button"
                className="dropMenuBtn"
                onClick={openAddGoalDialog}
              >
                Set goal
              </button>
            )}

            <button
              type="button"
              className="dropMenuBtn"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </ClickAwayListener>
      ) : null}
    </div>
  )
}
