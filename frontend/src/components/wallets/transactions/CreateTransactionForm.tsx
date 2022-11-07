import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React, { useState } from 'react'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import { Typography } from 'components/common/Typography'
import { InputField } from 'components/common/inputs/InputField'
import { Button } from 'components/common/buttons/Button'
import { REGEX } from 'shared/regexp'
import { convertToСoins } from '../helpers/convertFunction'
import { AsyncThunk } from '@reduxjs/toolkit'
import clsx from 'clsx'
import { CostsCategories } from 'common/enums/costsCategories.enum'
import { IncomeCategories } from 'common/enums/incomesCategories.enum'
import { wordToUpperCase } from '../helpers/wordToUC'
import { createTransactionValidateSchema } from '../validationSchemas/transactionValidateSchema'
import { updateMoneyBox } from 'redux/slice/moneyBoxesSlice'

interface IDetails {
  title: string
  labelName: string
  placeholderName: string
  labelSum: string
  buttonLabel: string
}

interface ICreateTransactionFormProps {
  submitFunction: AsyncThunk<
    any,
    ICreateTransactionParams,
    { rejectValue: string }
  >
  limit: number
  details: IDetails
  isShow: boolean
  categories: CostsCategories[] | IncomeCategories[]
  loading: boolean
}
export interface ICreateTransactionDto {
  name: string
  sum: number
  categoryName: CostsCategories | IncomeCategories
}
export interface ICreateTransactionParams {
  walletId: number
  limit: number
  data: ICreateTransactionDto
}

export const CreateTransactionForm: React.FC<ICreateTransactionFormProps> = ({
  submitFunction,
  limit,
  details,
  isShow,
  categories,
  loading,
}) => {
  const [tramsactionSum, setTramsactionSum] = useState(0)
  const [isPositiveSum, setIsPositiveSum] = useState(false)

  const { title, labelName, placeholderName, labelSum, buttonLabel } = details

  const dispatch = useAppDispatch()

  const currentWalet = useAppSelector((state) => state.wallets.activeWallet)

  const initialValues: ICreateTransactionDto = {
    name: '',
    sum: tramsactionSum,
    categoryName: categories[0],
  }

  const handleSubmit = (
    values: ICreateTransactionDto,
    actions: FormikHelpers<ICreateTransactionDto>,
  ) => {
    if (currentWalet) {
      const forSubmit: ICreateTransactionParams = {
        walletId: currentWalet.id,
        limit,
        data: {
          ...values,
          sum: convertToСoins(tramsactionSum),
        },
      }

      dispatch(submitFunction(forSubmit))

      const forMoneyBox = {
        walletId: currentWalet.id,
        type: labelSum,
        data: {
          ...values,
          sum: convertToСoins(tramsactionSum),
        },
      }

      dispatch(updateMoneyBox(forMoneyBox))
    }

    actions.resetForm({
      values: {
        name: '',
        sum: 0,
        categoryName: categories[0],
      },
    })
    setTramsactionSum(0)
    setIsPositiveSum(false)
  }

  const checkSum = (value: string) => {
    if (!value.match(REGEX.POSITIVE_DECIMAL_NUMBER)) {
      return setTramsactionSum(tramsactionSum)
    }
    setTramsactionSum(+value)
  }

  return (
    <div className={clsx('min-h-min', isShow ? 'block' : 'hidden')}>
      <Formik
        initialValues={initialValues}
        validationSchema={createTransactionValidateSchema}
        onSubmit={handleSubmit}
      >
        {({ dirty, isValid }) => {
          return (
            <Form>
              <Typography className="mb-4" type="h4">
                {title}
              </Typography>
              <InputField
                label={labelName}
                name="name"
                type="text"
                placeholder={placeholderName}
              />
              <div className="flex justify-around my-4">
                <InputField
                  onChange={(e) => {
                    checkSum(e.target.value)
                    ;+e.target.value > 0
                      ? setIsPositiveSum(true)
                      : setIsPositiveSum(false)
                  }}
                  label={labelSum}
                  value={+tramsactionSum}
                  name="sum"
                  type="number"
                  className="w-7/12"
                />
                <div className="flex flex-col justify-end">
                  <label htmlFor="category">
                    <Typography type={'Ag-14-regular'}>Category</Typography>
                  </label>
                  <Field
                    id="category"
                    name="categoryName"
                    as="select"
                    className="rounded-md border-green-light text-gray-700"
                  >
                    {categories.map((category) => (
                      <option
                        className="text-gray-700"
                        key={category}
                        value={category}
                      >
                        {wordToUpperCase(category)}
                      </option>
                    ))}
                  </Field>
                </div>
              </div>
              <Button
                label={buttonLabel}
                type="submit"
                btnName="primary"
                disabled={!(isValid && dirty && isPositiveSum && !loading)}
              />
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
