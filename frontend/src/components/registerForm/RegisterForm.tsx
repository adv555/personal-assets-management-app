import { Button } from 'components/common/buttons/Button'
import React, { useCallback } from 'react'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import InputUI from '../../ui/input/InputUI'
import { Form, Formik } from 'formik'
import { validationsSchemaRegister } from './schemasAuth/ValidationSchemaAuth'
import { Registration } from 'redux/thunk/authThunk'
import { Link } from 'react-router-dom'
import { AppRoute } from 'common/enums/app-route.enum'
import { Typography } from 'components/common/Typography'
import { GoogleLink } from 'components/common/GoogleLink/GoogleLink'

type PropsRegisterForm = {
  toggleFunction?: React.MouseEventHandler<HTMLButtonElement>
}

const RegisterForm: React.FC<PropsRegisterForm> = ({ toggleFunction }: any) => {
  const dispatch = useAppDispatch()

  const clickButton = useCallback(
    ({ firstName, lastName, email, password }: any) => {
      const params = { firstName, lastName, email, password }

      dispatch(Registration(params))
      toggleFunction()
    },
    [],
  )

  return (
    <div className="w-full h-full px-14">
      <Typography type={'h1'} className="text-center mb-8">
        Create new account
      </Typography>

      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validateOnBlur
        onSubmit={(registerData) => clickButton(registerData)}
        validationSchema={validationsSchemaRegister}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isValid,
          dirty,
        }) => (
          <div>
            <Form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-xl font-medium mb-1"
                  htmlFor="username"
                >
                  <Typography type={'Ag-16-medium'}> First name</Typography>
                </label>
                <InputUI
                  type={'text'}
                  name={'firstName'}
                  placeholder={'First name'}
                  value={values.firstName}
                  setValue={handleChange}
                  onBlur={handleBlur}
                  error={touched.firstName && errors.firstName ? false : true}
                ></InputUI>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-xl font-medium mb-1"
                  htmlFor="username"
                >
                  <Typography type={'Ag-16-medium'}> Last name</Typography>
                </label>
                <InputUI
                  type={'text'}
                  name={'lastName'}
                  placeholder={'Last name'}
                  value={values.lastName}
                  setValue={handleChange}
                  onBlur={handleBlur}
                  error={touched.lastName && errors.lastName ? false : true}
                ></InputUI>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-xl font-medium mb-1"
                  htmlFor="username"
                >
                  <Typography type={'Ag-16-medium'}>Email</Typography>
                </label>
                <InputUI
                  type={'email'}
                  name={'email'}
                  placeholder={'Email'}
                  value={values.email}
                  setValue={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && errors.email ? false : true}
                ></InputUI>
              </div>
              {touched.email && errors.email && (
                <p
                  className="text-red-600 italic text-sm"
                  style={{ margin: '0', position: 'relative', bottom: '12px' }}
                >
                  {errors.email}
                </p>
              )}

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-xl font-medium mb-1"
                  htmlFor="username"
                >
                  <Typography type={'Ag-16-medium'}>Password</Typography>
                </label>
                <InputUI
                  type={'password'}
                  name={'password'}
                  placeholder={'Password'}
                  value={values.password}
                  setValue={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && errors.password ? false : true}
                ></InputUI>
              </div>
              {touched.password && errors.password && (
                <p
                  className="text-red-600 italic text-sm"
                  style={{ margin: '0', position: 'relative', bottom: '12px' }}
                >
                  {errors.password}
                </p>
              )}

              <div className="mb-4 w-full p-0">
                <label
                  className="block text-gray-700 text-xl font-medium mb-1"
                  htmlFor="username"
                >
                  <Typography type={'Ag-16-medium'}>
                    Confirm password
                  </Typography>
                </label>
                <InputUI
                  type={'password'}
                  name={'confirmPassword'}
                  placeholder={'Confirm password'}
                  value={values.confirmPassword}
                  setValue={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.confirmPassword && errors.confirmPassword
                      ? false
                      : true
                  }
                ></InputUI>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <span
                  className="text-red-600 italic text-sm"
                  style={{ margin: '0', position: 'relative', bottom: '12px' }}
                >
                  {errors.confirmPassword}
                </span>
              )}
              <Button
                disabled={!isValid && !dirty}
                type={'submit'}
                btnName={'primary'}
                label={'Create account'}
                className="w-full m-0 mt-10"
              />
            </Form>
          </div>
        )}
      </Formik>

      {/* <Link to={`${AppRoute.HOME}`}> */}
      <div onClick={toggleFunction} className="mt-5 text-center cursor-pointer">
        <GoogleLink type={'sign-in'} to={AppRoute.HOME} />
      </div>
      {/* </Link> */}
    </div>
  )
}

export default RegisterForm
