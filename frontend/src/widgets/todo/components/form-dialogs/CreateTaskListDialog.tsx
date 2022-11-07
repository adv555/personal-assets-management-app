import React from 'react'
import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import { DialogContentText } from '@mui/material'
import TextField from '@mui/material/TextField'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { Formik, FormikErrors } from 'formik'
import { createTaskList } from 'redux/slice/todo/todo.slice'
import { useAppDispatch } from 'hooks/useAppDispatch'
import { colors } from 'widgets/todo/styles/colors'

interface FormValues {
  title: string
}

export default function CreateTaskListDialog() {
  const [open, setOpen] = useState(false)
  const dispatch = useAppDispatch()

  const openClickHandler = () => setOpen(true)
  const closeHandler = () => setOpen(false)

  const addList = (title: string) => {
    dispatch(createTaskList(title))
    setOpen(false)
  }

  const initialValues: FormValues = { title: 'New list' }

  return (
    <>
      <Button
        onClick={openClickHandler}
        sx={{ color: colors.green, textTransform: 'capitalize' }}
      >
        New List
      </Button>

      <Dialog open={open} onClose={closeHandler}>
        <DialogTitle>New Task List</DialogTitle>
        <Formik
          initialValues={initialValues}
          validate={(values) => {
            const errors: FormikErrors<FormValues> = {}

            if (!values.title) {
              errors.title = 'Required'
            } else if (values.title.length > 40) {
              errors.title = 'Max length 40'
            }

            return errors
          }}
          onSubmit={(values) => addList(values.title)}
        >
          {({ values, errors, handleSubmit, handleChange }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent>
                <DialogContentText>
                  Please enter title of list
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  label="List Title"
                  type="text"
                  fullWidth
                  variant="standard"
                  size="small"
                  value={values.title}
                  name="title"
                  onChange={handleChange}
                />
                <div className="text-red-500">{errors.title}</div>
              </DialogContent>
              <DialogActions>
                <Button variant="outlined" onClick={closeHandler}>
                  Cancel
                </Button>
                <Button variant="contained" type="submit">
                  CREATE
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
    </>
  )
}
