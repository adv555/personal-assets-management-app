import { Currencies } from 'common/enums/currency.enum'
import React from 'react'
import { Field, Form, Formik } from 'formik'
import { Typography } from 'components/common/Typography'
import { InputField } from 'components/common/inputs/InputField'
import { Button } from 'components/common/buttons/Button'
import { ReactComponent as Cross } from '../../assets/icons/cross-icon.svg'
import { addNewWallets, IWalletDto } from 'redux/slice/walletsSlice'
import { useAppDispatch } from 'hooks/useAppDispatch'
import { createWalletValidateSchema } from './validationSchemas/walletValidationSchem'

interface AddWalletFormProps {
  toggleShowAddForm: () => void
}

const initialValues: IWalletDto = {
  wallet_name: '',
  currency: Currencies.UAH,
}

export const AddWalletForm: React.FC<AddWalletFormProps> = ({
  toggleShowAddForm,
}) => {
  const dispatch = useAppDispatch()
  const currency = Object.values(Currencies)

  const handleSubmit = (values: IWalletDto) => {
    dispatch(addNewWallets(values))
    toggleShowAddForm()
  }

  return (
    <div className="mt-5 w-11/12 p-3 bg-gray-100 rounded-md">
      <Formik<IWalletDto>
        initialValues={initialValues}
        validationSchema={createWalletValidateSchema}
        onSubmit={handleSubmit}
      >
        {({ dirty, isValid }) => {
          return (
            <Form>
              <Typography className="mb-4" type="h4">
                New Wallet
              </Typography>
              <InputField
                label="Wallet Name"
                name="wallet_name"
                type="text"
                placeholder="My Wallet"
              />
              <div className="flex items-center justify-around my-2">
                <label htmlFor="currency">Currency</label>
                <Field
                  id="currency"
                  name="currency"
                  as="select"
                  className="rounded-md border-green-light"
                >
                  {currency.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </Field>
              </div>
              <div className="flex justify-around">
                <Button
                  label="Create Wallet"
                  type="submit"
                  btnName="primary"
                  disabled={!(isValid && dirty)}
                />
                <Button
                  label="Cancel"
                  type="button"
                  btnName="delete"
                  icon={<Cross />}
                  onClick={toggleShowAddForm}
                />
              </div>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
