import React, { useEffect, useState } from 'react'
import { TransactionLinks } from '../TransactionLinks'
import { CreateTransactionForm } from '../CreateTransactionForm'
import {
  addNewCost,
  deleteCost,
  fetchCosts,
  fetchMoreCosts,
  IGetMoreCostsParams,
  setCostError,
  setCostSuccess,
  setCurrentCost,
  setOffset,
  updateCost,
} from 'redux/slice/costsSlice'
import { TransactionsItem } from '../TransactionsItem'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import { Button } from 'components/common/buttons/Button'
import { Typography } from 'components/common/Typography'
import { Link } from 'react-router-dom'
import { CostsCategoryValues } from 'common/enums/costsCategories.enum'
import { ShowTransactionFragment } from 'components/wallets/helpers/enums/showTransactionFragment.enum'
import { UpdateTransactionForm } from '../UpdateTransactionForm'
import { notifyError, notifySuccess } from 'components/common/notifications'
import { LoadingStatus } from 'common/enums/loading-status'
import { WalletStatus } from 'common/enums/walletStatus.enum'

export const CostsList: React.FC = () => {
  const [showFragment, setShowFragment] = useState<ShowTransactionFragment>(
    ShowTransactionFragment.LIST,
  )

  const dispatch = useAppDispatch()

  const {
    costs,
    currency,
    limit,
    offset,
    costs_count: costsCount,
    currentCost,
    loading,
    errorMessage: error,
    successMessage: success,
  } = useAppSelector((state) => state.costs)

  const { wallets, activeWallet: currentWallet } = useAppSelector(
    (state) => state.wallets,
  )

  useEffect(() => {
    setShowFragment(ShowTransactionFragment.LIST)
    if (currentWallet) {
      dispatch(
        fetchCosts({
          walletId: currentWallet.id,
          limit,
        }),
      )
    }
  }, [currentWallet])

  useEffect(() => {
    error && notifyError(error)

    return () => {
      dispatch(setCostError(null))
    }
  }, [error])

  useEffect(() => {
    success && notifySuccess(success)

    return () => {
      dispatch(setCostSuccess(null))
    }
  }, [success])

  const getMoreCosts = (params: IGetMoreCostsParams) => {
    const costsResidue = costsCount - costs.length

    if (costsResidue < limit) {
      dispatch(setOffset(offset + costsResidue))

      return dispatch(fetchMoreCosts(params))
    }
    dispatch(setOffset(offset + limit))
    dispatch(fetchMoreCosts(params))
  }

  return (
    <div className="col-span-2 px-4 mt-5">
      {currentWallet && wallets.length > 0 ? (
        <>
          <TransactionLinks
            type="cost"
            show={showFragment}
            setShow={setShowFragment}
            details={{
              title: 'My Costs',
              listName: 'Wallets Costs',
              createName: 'Create Cost',
            }}
          />
          <div className="bg-gray-300 h-px my-3"></div>
          {costs?.length === 0 &&
            showFragment === ShowTransactionFragment.LIST && (
              <div className="flex items-center justify-center mt-5">
                <Typography type="Ag-18-semibold">
                  You dont have any costs yet
                </Typography>
                {currentWallet.status !== WalletStatus.CLOSE && (
                  <Link
                    className="ml-4 underline underline-offset-4 transition-colors hover:underline hover:underline-offset-4 hover:text-lime-500"
                    to="#"
                    onClick={() => {
                      setShowFragment(ShowTransactionFragment.CREATE)
                    }}
                  >
                    Add Cost
                  </Link>
                )}
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
              {costs.map((cost) => (
                <TransactionsItem
                  key={cost.id}
                  type="cost"
                  currency={currency}
                  details={{
                    name: cost.cost_name,
                    sum: cost.cost_sum,
                  }}
                  setShow={setShowFragment}
                  transaction={cost}
                  setTransaction={setCurrentCost}
                />
              ))}
            </ul>
            {costsCount > costs?.length && (
              <Button
                label="Show more"
                type="button"
                btnName="secondaryWithoutFocus"
                disabled={loading === LoadingStatus.LOADING}
                onClick={() => {
                  if (currentWallet) {
                    getMoreCosts({
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
            submitFunction={addNewCost}
            limit={limit}
            details={{
              title: 'Add cost',
              labelName: 'Cost name',
              placeholderName: 'My Cost',
              labelSum: 'Cost amount',
              buttonLabel: 'Create Cost',
            }}
            isShow={showFragment === ShowTransactionFragment.CREATE}
            categories={CostsCategoryValues}
            loading={loading === LoadingStatus.LOADING}
          />
          {showFragment === ShowTransactionFragment.UPDATE && currentCost && (
            <UpdateTransactionForm
              type="cost"
              transaction={currentCost}
              updateFunction={updateCost}
              deleteFunction={deleteCost}
              limit={limit}
              isShow={setShowFragment}
              details={{
                title: 'Update cost',
                labelName: 'Cost name',
                placeholderName: 'My Cost',
                labelSum: 'Cost amount',
              }}
              categories={CostsCategoryValues}
            />
          )}
        </>
      ) : null}
    </div>
  )
}
