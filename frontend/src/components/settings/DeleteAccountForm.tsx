import React, { useState } from 'react'
import { Button } from 'components/common/buttons/Button'
import { Field, Form, Formik, FormikProps } from 'formik'
import { PasswordInput } from 'components/common/inputs/PasswordInput'
import { deleteAccountSchema } from './schemas/deleteAccountSchema'
import { SectionTitle } from './SectionTitle'
import { ReactComponent as PenIcon } from 'assets/icons/pen.svg'
import { useAppDispatch } from 'hooks/useAppDispatch'
import {
  deleteUserProfile,
  resetUserProfileStore,
} from 'redux/slice/userProfile/actionCreators'
import { useNavigate } from 'react-router-dom'
import { AppRoute } from 'common/enums/app-route.enum'
import { Logout } from 'redux/thunk/authThunk'

interface DeleteAccountProps {
  currentPassword: string
  confirmCurrentPassword: string
}

const InitialValues: DeleteAccountProps = {
  currentPassword: '',
  confirmCurrentPassword: '',
}

const DeleteAccountForm = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [isVisible, setIsVisible] = useState(false)

  const logout = React.useCallback(() => {
    try {
      dispatch(Logout())
      dispatch(resetUserProfileStore())
      navigate(AppRoute.HOME)
    } catch (e) {
      console.log(e)
    }
  }, [])

  const handleSubmit = (values: typeof InitialValues) => {
    dispatch(deleteUserProfile({ password: values.currentPassword }))
    logout()
  }

  return (
    <Formik
      initialValues={InitialValues}
      validateOnBlur={true}
      validateOnChange={true}
      validationSchema={deleteAccountSchema}
      onSubmit={handleSubmit}
    >
      {(props: FormikProps<DeleteAccountProps>) => {
        const { dirty, isValid, errors, handleBlur, handleChange, values } =
          props

        return (
          <>
            <SectionTitle
              title={'Delete Account'}
              subTitle={
                'To delete your account, enter your password and confirm it.'
              }
              icon={<PenIcon />}
              iconLabel={'Edit'}
              onClick={() => setIsVisible(!isVisible)}
            />

            {isVisible && (
              <Form className="flex flex-col gap-8 mb-5">
                <div className="flex flex-col gap-5 sm:flex-row">
                  <Field
                    label={'Current Password'}
                    name={'currentPassword'}
                    id={'currentPassword'}
                    placeholder={'e.g. *******'}
                    values={values.currentPassword}
                    error={errors.currentPassword}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    component={PasswordInput}
                    className="sm:w-1/2"
                  />

                  <Field
                    label={'Confirm Password'}
                    name={'confirmCurrentPassword'}
                    id={'confirmCurrentPassword'}
                    placeholder={'e.g. *******'}
                    values={values.confirmCurrentPassword}
                    error={errors.confirmCurrentPassword}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    className="sm:w-1/2"
                    component={PasswordInput}
                  />
                </div>
                <div className="flex justify-center lg:justify-end">
                  <div className="w-full lg:w-1/2">
                    <Button
                      label={'Delete Account'}
                      type={'submit'}
                      btnName={'primary'}
                      disabled={!(isValid && dirty)}
                    />
                  </div>
                </div>
              </Form>
            )}
          </>
        )
      }}
    </Formik>
  )
}

export default DeleteAccountForm
