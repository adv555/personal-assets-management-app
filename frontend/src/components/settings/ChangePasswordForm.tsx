import React, { useState } from 'react'
import { Field, Form, Formik } from 'formik'
import { Button } from 'components/common/buttons/Button'
import { PasswordInput } from 'components/common/inputs/PasswordInput'
import { changePasswordSchema } from './schemas/changePasswordSchema'
import { SectionTitle } from './SectionTitle'
import { ReactComponent as PenIcon } from 'assets/icons/pen.svg'
import { useAppDispatch } from 'hooks/useAppDispatch'
import { updateUserProfile } from 'redux/slice/userProfile/actionCreators'

export interface IChangePassword {
  newPassword: string
  confirmPassword: string
}

const InitialValues: IChangePassword = {
  newPassword: '',
  confirmPassword: '',
}

const ChangePasswordForm: React.FC = () => {
  const dispatch = useAppDispatch()
  const [isVisible, setIsVisible] = useState(false)

  const handleSubmit = (values: IChangePassword) => {
    const newUserPassword = { password: values.newPassword }

    dispatch(updateUserProfile(newUserPassword))
    setIsVisible(false)
  }

  return (
    <Formik
      initialValues={InitialValues}
      validateOnBlur={true}
      validateOnChange={true}
      validationSchema={changePasswordSchema}
      onSubmit={handleSubmit}
    >
      {({ dirty, isValid, errors, handleBlur, handleChange, values }) => {
        return (
          <>
            <SectionTitle
              title={'Change Password'}
              subTitle={
                'To change your password, enter your new password and confirm it.'
              }
              icon={<PenIcon />}
              iconLabel={'Edit'}
              onClick={() => setIsVisible(!isVisible)}
            />

            {isVisible && (
              <Form className={'flex flex-col gap-8 mb-5'}>
                <div className="flex flex-col gap-5 sm:flex-row">
                  <Field
                    label={'New Password'}
                    name={'newPassword'}
                    id={'newPassword'}
                    placeholder={'e.g. *******'}
                    values={values.newPassword}
                    error={errors.newPassword}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    component={PasswordInput}
                    className="sm:w-1/2"
                  />

                  <Field
                    label={'Confirm Password'}
                    name={'confirmPassword'}
                    id={'confirmPassword'}
                    placeholder={'e.g. *******'}
                    values={values.confirmPassword}
                    error={errors.confirmPassword}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    className="sm:w-1/2"
                    component={PasswordInput}
                  />
                </div>
                <div className="flex justify-center lg:justify-end">
                  <div className="w-full lg:w-1/2">
                    <Button
                      label={'Change Password'}
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

export default ChangePasswordForm
