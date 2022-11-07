import React from 'react'
import { Button } from 'components/common/buttons/Button'
import { Select } from 'components/common/inputs/select'

import { Form, Formik, FormikProps } from 'formik'

import { fetchCreateWalletLimit } from '../../redux/slice/walletLimitActions'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'

interface AddWalletLimitsFormProps {
  walletId: number
}

const AddWalletLimitsForm = () => {
  const dispatch = useAppDispatch()
  const wallets = useAppSelector((state) => state.wallets.wallets)

  const InitialValues: AddWalletLimitsFormProps = {
    walletId: wallets[0]?.id | 0,
  }

  const handleSubmit = async (values: any) => {
    dispatch(fetchCreateWalletLimit(values.walletId))
  }

  return (
    <>
      <Formik
        initialValues={InitialValues}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {(props: FormikProps<any>) => {
          const { isValid, handleChange } = props

          return (
            <>
              {wallets.length > 0 ? (
                <Form onSubmit={props.handleSubmit}>
                  <div className="flex flex-col justify-between items-center gap-5 sm:flex-row">
                    <Select
                      type={'select'}
                      name={'walletId'}
                      optionArray={wallets.map((wallet) => ({
                        value: wallet.id,
                        name: wallet.wallet_name,
                      }))}
                      onChange={handleChange}
                      className={'w-full sm:w-1/2'}
                    />
                    <Button
                      label={'Add wallet limit'}
                      type={'submit'}
                      btnName={'primary'}
                      className={'sm:w-1/2'}
                      disabled={!isValid}
                    />
                  </div>
                </Form>
              ) : (
                <>
                  You don&apos;t have wallets
                  <br />
                  Please, add some wallets and comeback to setup this settings
                </>
              )}
            </>
          )
        }}
      </Formik>
    </>
  )
}

export default AddWalletLimitsForm
