import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React, { useState } from 'react'
import { Field, Form, Formik } from 'formik'
import { Typography } from 'components/common/Typography'
import { InputField } from 'components/common/inputs/InputField'
import { REGEX } from 'shared/regexp'
import { convertToMoney, convertToСoins } from '../helpers/convertFunction'
import { AsyncThunk } from '@reduxjs/toolkit'
import { CostsCategories } from 'common/enums/costsCategories.enum'
import { IncomeCategories } from 'common/enums/incomesCategories.enum'
import { wordToUpperCase } from '../helpers/wordToUC'
import { ReactComponent as PenIcon } from 'assets/icons/pen.svg'
import { ReactComponent as DeleteIcon } from 'assets/icons/delete-icon.svg'
import { formatCurrentDate } from '../helpers/formatDate'
import { ShowTransactionFragment } from '../helpers/enums/showTransactionFragment.enum'
import { Button } from 'components/common/buttons/Button'
import { updateTransactionValidateSchema } from '../validationSchemas/transactionValidateSchema'
import {
  ICreateTransactionDto,
  ICreateTransactionParams,
} from './CreateTransactionForm'
import clsx from 'clsx'
import { WalletStatus } from 'common/enums/walletStatus.enum'

interface IDetails {
  title: string
  labelName: string
  placeholderName: string
  labelSum: string
}

interface IUpdateTransactionFormProps {
  type: 'cost' | 'income'
  transaction: any
  updateFunction: AsyncThunk<
    any,
    IUpdateTransactionParams,
    { rejectValue: string }
  >
  deleteFunction: AsyncThunk<any, IDeleteTransaction, { rejectValue: string }>
  limit: number
  isShow: (value: ShowTransactionFragment) => void
  details: IDetails
  categories: CostsCategories[] | IncomeCategories[]
}

interface IUpdateTransactionDto extends ICreateTransactionDto {
  createdAt: Date
}

export interface IUpdateTransactionParams extends ICreateTransactionParams {
  transactionId: number
  data: IUpdateTransactionDto
}

export interface IDeleteTransaction {
  transactionId: number
  walletId: number
  limit: number
}

export const UpdateTransactionForm: React.FC<IUpdateTransactionFormProps> = ({
  type,
  transaction,
  updateFunction,
  deleteFunction,
  limit,
  isShow,
  details,
  categories,
}) => {
  const { title, labelName, placeholderName, labelSum } = details

  const initialTramsactionSum =
    type === 'cost' ? transaction.cost_sum : transaction.income_sum

  const [tramsactionSum, setTramsactionSum] = useState(
    convertToMoney(initialTramsactionSum),
  )
  const [isPositiveSum, setIsPositiveSum] = useState(true)

  const dispatch = useAppDispatch()
  const currentWallet = useAppSelector((state) => state.wallets.activeWallet)

  const initialValues = {
    name: type === 'cost' ? transaction.cost_name : transaction.income_name,
    sum: tramsactionSum,
    categoryName: transaction.category_name,
    createdAt: formatCurrentDate(transaction.createdAt),
  }

  const checkSum = (value: string) => {
    if (!value.match(REGEX.POSITIVE_DECIMAL_NUMBER)) {
      return setTramsactionSum(tramsactionSum)
    }
    setTramsactionSum(+value)
  }

  const handleSubmit = (values: typeof initialValues) => {
    if (transaction.id && currentWallet) {
      const forSubmit: IUpdateTransactionParams = {
        transactionId: transaction.id,
        walletId: currentWallet.id,
        limit,
        data: {
          ...values,
          sum: convertToСoins(tramsactionSum),
          createdAt: new Date(values.createdAt),
        },
      }

      dispatch(updateFunction(forSubmit))
      isShow(ShowTransactionFragment.LIST)
    }
  }

  return (
    <>
      {transaction && (
        <div className="min-h-min">
          <Formik
            initialValues={initialValues}
            validationSchema={updateTransactionValidateSchema}
            onSubmit={handleSubmit}
          >
            {({ isValid }) => {
              return (
                <Form>
                  <Typography className="mb-4" type="h4">
                    {title}
                  </Typography>
                  <div className="flex justify-start mb-5 gap-5">
                    <InputField
                      label={labelName}
                      name="name"
                      type="text"
                      placeholder={placeholderName}
                      className="w-5/12"
                    />
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
                      className={clsx(
                        'w-5/12',
                        type === 'cost' &&
                          currentWallet?.status === WalletStatus.CLOSE &&
                          'hidden',
                      )}
                    />
                  </div>
                  <div className="flex justify-start items-start gap-5 mb-4">
                    <InputField
                      label="Date"
                      type="date"
                      name="createdAt"
                      className="w-5/12"
                    />
                    <div className="flex flex-col justify-end">
                      <label className="mb-1" htmlFor="category">
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
                  <div className="flex items-center justify-around">
                    <Button
                      icon={<PenIcon />}
                      disabled={!(isValid && isPositiveSum)}
                      type="submit"
                      btnName="tertiary2"
                      label="Save"
                    />
                    <Button
                      className={clsx(
                        type === 'cost' &&
                          currentWallet?.status === WalletStatus.CLOSE &&
                          'hidden',
                      )}
                      icon={<DeleteIcon />}
                      type="button"
                      btnName="delete"
                      label="Delete"
                      onClick={() => {
                        if (currentWallet) {
                          dispatch(
                            deleteFunction({
                              transactionId: transaction.id,
                              walletId: currentWallet.id,
                              limit,
                            }),
                          )
                        }
                        isShow(ShowTransactionFragment.LIST)
                      }}
                    />
                    <Button
                      type="button"
                      btnName="delete"
                      label="Cancel"
                      className="text-lime-600"
                      onClick={() => {
                        isShow(ShowTransactionFragment.LIST)
                      }}
                    />
                  </div>
                </Form>
              )
            }}
          </Formik>
        </div>
      )}
    </>
  )
}
