import React from 'react'
import { Field, Form, Formik } from 'formik'
import { InputField } from 'components/common/inputs/InputField'
import { Button } from 'components/common/buttons/Button'
import { ReactComponent as Cross } from 'assets/icons/cross-icon.svg'
import { ReactComponent as OkIcon } from 'assets/icons/ok-icon.svg'
import { updateWallet, IWallet } from 'redux/slice/walletsSlice'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import { ShowWalletFooter } from './Wallet'
import { LoadingStatus } from 'common/enums/loading-status'
import { updateWalletValidateSchema } from './validationSchemas/walletValidationSchem'
import { wordToUpperCase } from './helpers/wordToUC'
import { WalletStatusValues } from 'common/enums/walletStatus.enum'
import { Typography } from 'components/common/Typography'

interface IUpdateWalletFormProps {
  wallet: IWallet
  setWalletFooter: (value: ShowWalletFooter) => void
}

export const UpdateWalletForm: React.FC<IUpdateWalletFormProps> = ({
  setWalletFooter,
  wallet,
}) => {
  const dispatch = useAppDispatch()
  const loading = useAppSelector((state) => state.wallets.loading)

  const initialValues = {
    wallet_name: wallet.wallet_name,
    status: wallet.status,
  }

  const handleSubmit = (values: typeof initialValues) => {
    dispatch(updateWallet({ data: values, walletId: wallet.id }))
    setWalletFooter(ShowWalletFooter.CLOSE)
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={updateWalletValidateSchema}
      onSubmit={handleSubmit}
    >
      {({ dirty, isValid }) => {
        return (
          <Form className="my-3">
            <div className="lg:grid lg:grid-rows-1 lg:grid-cols-12">
              <InputField
                className="lg:col-span-7 mb-3 lg:mb-0 max-w-full"
                label="Wallet Name"
                name="wallet_name"
                type="text"
                placeholder="My Wallet"
              />
              <div className="col-span-1"></div>
              <div className="flex flex-col justify-end lg:col-span-4">
                <label className="mb-1" htmlFor="category">
                  <Typography type="Ag-14-regular">Status</Typography>
                </label>
                <Field
                  id="status"
                  name="status"
                  as="select"
                  className="rounded-md border-green-light text-gray-700"
                >
                  {WalletStatusValues.map((status) => (
                    <option
                      className="text-gray-700"
                      key={status}
                      value={status}
                    >
                      {wordToUpperCase(status)}
                    </option>
                  ))}
                </Field>
              </div>
            </div>

            <div className="flex justify-around">
              <Button
                label="Save"
                type="submit"
                btnName="tertiary2"
                icon={<OkIcon />}
                disabled={
                  !(isValid && dirty && loading !== LoadingStatus.LOADING)
                }
              />
              <Button
                label="Cancel"
                type="button"
                btnName="delete"
                icon={<Cross />}
                onClick={() => {
                  setWalletFooter(ShowWalletFooter.CLOSE)
                }}
              />
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}
