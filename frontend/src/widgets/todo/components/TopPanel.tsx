import React from 'react'
import CreateTaskListDialog from './form-dialogs/CreateTaskListDialog'
import IconButton from '@mui/material/IconButton'
import { ReactComponent as ArrowLeftIcon } from 'assets/icons/arrow-left.svg'
import { ReactComponent as ArrowRightIcon } from 'assets/icons/arrow-right.svg'
import { useDispatch } from 'react-redux'
import { useAppSelector } from 'hooks/useAppDispatch'
import { setCursor } from 'redux/slice/todo/todo.slice'
import { colors } from 'widgets/todo/styles/colors'
import { Cursor } from './Cursor'

export function TopPanel() {
  const dispatch = useDispatch()

  const listCount = useAppSelector((state) => state.todo.lists.length)
  const cursor = useAppSelector((state) => state.todo.cursor)

  const showNextList = () => {
    const next = (cursor + 1) % listCount

    dispatch(setCursor(next))
  }
  const showPrevList = () => {
    const prev = cursor - 1 < 0 ? listCount - 1 : cursor - 1

    dispatch(setCursor(prev))
  }

  const listsTwoOrMore = listCount >= 2

  return (
    <>
      <header className="p-6 pb-3">
        <div className="flex items-center justify-between">
          <h4 className="text-h4 font-bold capitalize">Task lists</h4>
          <div>
            <CreateTaskListDialog />
            <IconButton
              color="primary"
              aria-label="show prev list"
              component="label"
              disabled={!listsTwoOrMore}
              onClick={showPrevList}
              sx={{ padding: 0, marginRight: 1, marginLeft: 1.4 }}
            >
              <ArrowLeftIcon
                fill={listsTwoOrMore ? colors.green : colors.lightGray}
              />
            </IconButton>
            <IconButton
              color="primary"
              aria-label="show next list"
              component="label"
              disabled={listCount < 2}
              onClick={showNextList}
              sx={{ padding: 0 }}
            >
              <ArrowRightIcon
                fill={listsTwoOrMore ? colors.green : colors.lightGray}
              />
            </IconButton>
          </div>
        </div>
        <Cursor listCount={listCount} cursor={cursor} />
      </header>
    </>
  )
}
