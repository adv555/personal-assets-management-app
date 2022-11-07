import React, { useCallback, useEffect } from 'react'
import { Button } from 'components/common/buttons/Button'
import AddWalletLimitsForm from './AddWalletLimitFrom'

import { Form, Formik, FormikProps } from 'formik'
import { WalletLimitsSchema } from './schemas/walletLimitsSchema'
import { SectionTitle } from './SectionTitle'
import { ReactComponent as PenIcon } from 'assets/icons/pen.svg'

import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import {
  fetchAllWalletLimits,
  fetchUpdateWalletLimit,
  fetchRemoveWalletLimit,
} from '../../redux/slice/walletLimitActions'
import { InputField } from 'components/common/inputs/InputField'

interface WalletLimitsFormProps {
  wallet_limit: number
  wallet_duration: number
}

const InitialValues: WalletLimitsFormProps = {
  wallet_limit: 1000,
  wallet_duration: 30,
}

const WalletLimitsForm: React.FC = () => {
  const dispatch = useAppDispatch()
  const walletLimits = useAppSelector((state) => state.walletLimit.walletLimits)

  const [editWalletId, setEditWalletId] = React.useState(0)

  useEffect(() => {
    dispatch(fetchAllWalletLimits())
  }, [])

  const handleSubmit = async (values: typeof InitialValues) => {
    const wallet_limit = values.wallet_limit
    const wallet_duration = values.wallet_duration

    const data = {
      wallet_limit: wallet_limit,
      wallet_duration: wallet_duration,
    }

    dispatch(fetchUpdateWalletLimit(editWalletId, data))
  }

  const toggleWalletBlock = useCallback((walletId: any = 0) => {
    if (editWalletId == 0) {
      setEditWalletId(walletId)
    } else {
      setEditWalletId(0)
    }
  }, [])

  const deleteWalletLimit = useCallback(() => {
    dispatch(fetchRemoveWalletLimit(editWalletId))
  }, [editWalletId])

  const getSubTitle = (wallet: any) => {
    return (
      'Wallet limit: ' +
      wallet.wallet_limit.toString() +
      ' ' +
      wallet.wallet.currency +
      ' and wallet duration: ' +
      wallet.wallet_duration.toString() +
      ' days'
    )
  }

  return (
    <>
      <SectionTitle
        title={'Wallets settings'}
        subTitle={'Create and edit wallets limits'}
      />

      <AddWalletLimitsForm />

      {walletLimits.map((row) => {
        return (
          <div key={row.id}>
            <SectionTitle
              title={`Change limits for: ${row.wallet.wallet_name}`}
              subTitle={getSubTitle(row)}
              icon={<PenIcon />}
              iconLabel={'Edit'}
              onClick={() => {
                toggleWalletBlock(row.id)
              }}
            />

            {editWalletId == row.id && (
              <>
                <Formik
                  initialValues={row}
                  onSubmit={handleSubmit}
                  enableReinitialize={true}
                  validateOnBlur={true}
                  validationSchema={WalletLimitsSchema}
                >
                  {(props: FormikProps<any>) => {
                    const {
                      dirty,
                      isValid,
                      errors,
                      handleBlur,
                      handleChange,
                      values,
                    } = props

                    return (
                      <>
                        <Form onSubmit={props.handleSubmit}>
                          <InputField
                            label={'Wallet limit'}
                            name={'wallet_limit'}
                            id={'wallet_limit'}
                            placeholder={'1000'}
                            type={'number'}
                            value={values.wallet_limit}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            className="sm:w-1/2"
                          />
                          <InputField
                            label={'Wallet duration'}
                            name={'wallet_duration'}
                            id={'wallet_duration'}
                            placeholder={'30'}
                            type={'number'}
                            value={values.wallet_duration}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            className="w-full sm:w-1/2"
                          />
                          <br />
                          <div className="flex flex-col gap-5 sm:flex-row">
                            <div className="w-full lg:w-1/3">
                              <Button
                                label={'Save'}
                                type={'submit'}
                                btnName={'primary'}
                                disabled={!isValid}
                              />
                            </div>
                            <div className="w-full lg:w-1/3">
                              <Button
                                label={'Delete'}
                                type={'button'}
                                onClick={deleteWalletLimit}
                                btnName={'tertiary2'}
                              />
                            </div>
                            <div className="w-full lg:w-1/3">
                              <Button
                                label={'Cancel'}
                                type={'button'}
                                onClick={toggleWalletBlock}
                                btnName={'tertiary'}
                              />
                            </div>
                          </div>
                        </Form>
                      </>
                    )
                  }}
                </Formik>
              </>
            )}
          </div>
        )
      })}
    </>
  )
}

export default WalletLimitsForm
