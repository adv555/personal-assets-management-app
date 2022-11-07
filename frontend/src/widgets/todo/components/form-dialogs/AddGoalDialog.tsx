import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'
import { Button } from 'components/common/buttons/Button'
import { Formik, FormikErrors } from 'formik'
import React from 'react'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import {
  addGoalToTask,
  toggleAddGoalDialogForTask,
} from 'redux/slice/todo/todo.slice'

interface AddGoalFormValues {
  walletId: number
  goalBalance: number
}

export function AddGoalDialog() {
  const dispatch = useAppDispatch()

  const wallets = useAppSelector((state) => state.wallets.wallets)
  const open = useAppSelector(
    (state) => state.todo.dialogState.addGoalDialogOpen,
  )
  const taskId = useAppSelector(
    (state) => state.todo.dialogState.adjustableTaskId,
  )

  const closeHandler = () =>
    dispatch(toggleAddGoalDialogForTask({ open: false }))

  const handleSubmit = (values: AddGoalFormValues) => {
    closeHandler()
    if (!taskId) throw new Error('taskId is missing from the state')
    dispatch(addGoalToTask({ ...values, taskId: taskId }))
  }

  return (
    <>
      <Dialog open={open}>
        <DialogTitle>Attach goal to task</DialogTitle>
        <Formik
          initialValues={{ walletId: 0, goalBalance: 1000 }}
          validate={(values) => {
            const errors: FormikErrors<AddGoalFormValues> = {}

            if (!values.walletId) {
              errors.walletId = 'Wallet is required'
            }

            if (!values.goalBalance) {
              errors.goalBalance = 'Goal balance is required'
            } else if (values.goalBalance < 1) {
              errors.goalBalance = 'Goal balance must be more 1'
            }

            return errors
          }}
          onSubmit={handleSubmit}
        >
          {({ values, errors, handleSubmit, handleChange }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent>
                <FormControl fullWidth>
                  <InputLabel id="walletSelectLabel">Wallet</InputLabel>
                  <Select
                    name="walletId"
                    value={values.walletId}
                    label="Wallet"
                    variant="outlined"
                    size="small"
                    onChange={handleChange}
                  >
                    {wallets.map((w) => (
                      <MenuItem key={w.id} value={w.id}>
                        {w.wallet_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <div className="text-red-500 mb-4">{errors.walletId}</div>

                <TextField
                  label="Goal balance"
                  type="number"
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={values.goalBalance}
                  name="goalBalance"
                  onChange={handleChange}
                />
                <div className="text-red-500 mb-4">{errors.goalBalance}</div>
              </DialogContent>
              <DialogActions>
                <Button
                  type="button"
                  onClick={closeHandler}
                  btnName="tertiary"
                  label="cancel"
                >
                  Cancel
                </Button>
                <Button type="submit" btnName="primary" label="Submit">
                  Attach goal
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
    </>
  )
}
