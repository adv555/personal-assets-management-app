import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React, { useState } from 'react'
import { addTask } from 'redux/slice/todo/todo.slice'
import { Button } from 'components/common/buttons/Button'
import { Input } from 'components/common/inputs/Input'
import { Formik, FormikHelpers } from 'formik'
import { FormikErrors } from 'formik'

interface FormValues {
  description: string
}

export function AddTaskForm() {
  const dispatch = useAppDispatch()

  const list = useAppSelector((state) => state.todo.lists[state.todo.cursor])
  const noLists = useAppSelector((state) => state.todo.lists.length < 1)

  const handleSubmit = (
    values: FormValues,
    helpers: FormikHelpers<FormValues>,
  ) => {
    dispatch(addTask({ ...values, listId: list.id }))
    helpers.resetForm()
  }

  const initialValues: FormValues = { description: '' }

  return (
    <Formik
      initialValues={initialValues}
      validate={(values) => {
        const errors: FormikErrors<FormValues> = {}

        if (!values.description) {
          errors.description = 'Required'
        } else if (values.description.length > 150) {
          errors.description = 'Max length 150 chars'
        }

        return errors
      }}
      onSubmit={handleSubmit}
    >
      {({ values, errors, handleSubmit, handleChange }) => (
        <form onSubmit={handleSubmit}>
          <div className="flex align-stretch">
            <div className="w-2/3 mr-2">
              <Input
                placeholder="Enter task description"
                disabled={noLists}
                type="text"
                value={values.description}
                name="description"
                onChange={handleChange}
              />
            </div>
            <div className="w-1/3">
              <Button
                type="submit"
                btnName="primary"
                disabled={noLists}
                label="Add task"
                className="m-0 h-full"
              />
            </div>
          </div>
          <div className="text-red-500">{errors.description}</div>
        </form>
      )}
    </Formik>
  )
}
