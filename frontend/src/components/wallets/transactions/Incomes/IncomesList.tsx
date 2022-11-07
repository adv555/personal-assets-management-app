import React, { useEffect, useState } from 'react'
import { TransactionLinks } from '../TransactionLinks'
import {
  addNewIncome,
  deleteIncome,
  fetchIncomes,
  fetchMoreIncomes,
  IGetMoreIncomesParams,
  setCurrentIncome,
  setIncomeError,
  setIncomeSuccess,
  setOffset,
  updateIncome,
} from 'redux/slice/incomeSlice'
import { CreateTransactionForm } from '../CreateTransactionForm'
import { TransactionsItem } from '../TransactionsItem'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import clsx from 'clsx'
import { Button } from 'components/common/buttons/Button'
import { Typography } from 'components/common/Typography'
import { Link } from 'react-router-dom'
import { IncomesCategoryValues } from 'common/enums/incomesCategories.enum'
import { UpdateTransactionForm } from '../UpdateTransactionForm'
import { ShowTransactionFragment } from 'components/wallets/helpers/enums/showTransactionFragment.enum'
import { notifyError, notifySuccess } from 'components/common/notifications'
import { LoadingStatus } from 'common/enums/loading-status'

export const IncomesList: React.FC = () => {
  const [showFragment, setShowFragment] = useState<ShowTransactionFragment>(
    ShowTransactionFragment.LIST,
  )

  const dispatch = useAppDispatch()

  const {
    incomes,
    currency,
    limit,
    offset,
    income_count: incomeCount,
    currentIncome,
    loading,
    errorMessage: error,
    successMessage: success,
  } = useAppSelector((state) => state.incomes)

  const { wallets, activeWallet: currentWallet } = useAppSelector(
    (state) => state.wallets,
  )

  useEffect(() => {
    setShowFragment(ShowTransactionFragment.LIST)
    if (currentWallet) {
      dispatch(
        fetchIncomes({
          walletId: currentWallet.id,
          limit,
        }),
      )
    }
  }, [currentWallet])

  useEffect(() => {
    error && notifyError(error)

    return () => {
      dispatch(setIncomeError(null))
    }
  }, [error])

  useEffect(() => {
    success && notifySuccess(success)

    return () => {
      dispatch(setIncomeSuccess(null))
    }
  }, [success])

  const getMoreIncomes = (params: IGetMoreIncomesParams) => {
    const incomeResidue = incomeCount - incomes.length

    if (incomeResidue < limit) {
      dispatch(setOffset(offset + incomeResidue))

      return dispatch(fetchMoreIncomes(params))
    }
    dispatch(setOffset(offset + limit))
    dispatch(fetchMoreIncomes(params))
  }

  return (
    <div className="col-span-2 px-4">
      {currentWallet && wallets?.length > 0 ? (
        <>
          <TransactionLinks
            type="income"
            show={showFragment}
            setShow={setShowFragment}
            details={{
              title: 'My Incomes',
              listName: 'Wallets Income',
              createName: 'Create Income',
            }}
          />
          <div className="bg-gray-300 h-px my-3"></div>
          {incomes?.length === 0 &&
            showFragment === ShowTransactionFragment.LIST && (
              <div className="flex items-center justify-center mt-5">
                <Typography type="Ag-18-semibold">
                  You dont have any incomes yet
                </Typography>
                <Link
                  className="ml-4  transition-colors hover:underline hover:underline-offset-4 hover:text-lime-500"
                  to="#"
                  onClick={() => {
                    setShowFragment(ShowTransactionFragment.CREATE)
                  }}
                >
                  Add Income
                </Link>
              </div>
            )}
          <div
            className={clsx(
              'overflow-auto h-80 overflow-x-hidden',
              showFragment === ShowTransactionFragment.LIST
                ? 'block'
                : 'hidden',
            )}
          >
            <ul>
              {incomes?.map((income) => (
                <TransactionsItem
                  key={income.id}
                  type="income"
                  currency={currency}
                  details={{
                    name: income.income_name,
                    sum: income.income_sum,
                  }}
                  setShow={setShowFragment}
                  transaction={income}
                  setTransaction={setCurrentIncome}
                />
              ))}
            </ul>
            {incomeCount > incomes?.length && (
              <Button
                label="Show more"
                type="button"
                btnName="secondaryWithoutFocus"
                disabled={loading === LoadingStatus.LOADING}
                onClick={() => {
                  if (currentWallet) {
                    getMoreIncomes({
                      walletId: currentWallet.id,
                      limit,
                      offset,
                    })
                  }
                }}
              />
            )}
          </div>
          <CreateTransactionForm
            submitFunction={addNewIncome}
            limit={limit}
            details={{
              title: 'Add income',
              labelName: 'Income name',
              placeholderName: 'My Income',
              labelSum: 'Income amount',
              buttonLabel: 'Create Income',
            }}
            isShow={showFragment === ShowTransactionFragment.CREATE}
            categories={IncomesCategoryValues}
            loading={loading === LoadingStatus.LOADING}
          />
          {showFragment === ShowTransactionFragment.UPDATE && currentIncome && (
            <UpdateTransactionForm
              type="income"
              transaction={currentIncome}
              updateFunction={updateIncome}
              deleteFunction={deleteIncome}
              limit={limit}
              isShow={setShowFragment}
              details={{
                title: 'Update income',
                labelName: 'Income name',
                placeholderName: 'My Income',
                labelSum: 'Income amount',
              }}
              categories={IncomesCategoryValues}
            />
          )}
        </>
      ) : (
        <>
          <Typography type="Ag-18-semibold">Add Wallets</Typography>
          <Typography className="mt-5" type="Ag-16-regular">
            Make a wallet and keep track of your income and costs. This is the
            first step toward financial security.
          </Typography>
        </>
      )}
    </div>
  )
}
