import { Button } from 'components/common/buttons/Button'
import React, { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch'
import {
  checkEmailAndSendCodeAgain,
  fetchLogin,
  verifyCodeAuth,
} from '../../redux/thunk/authThunk'
import InputUI from '../../ui/input/InputUI'
import GoogleButton from './googleButton/GoogleButton'
import { Form, Formik } from 'formik'
import * as yup from 'yup'
import { validationsSchemaLogin } from 'components/registerForm/schemasAuth/ValidationSchemaAuth'
import { Link } from 'react-router-dom'
import { AppRoute } from 'common/enums/app-route.enum'
import CheckCode from 'components/forgotPaswordForm/CheckCode'
import { GoogleLink } from 'components/common/GoogleLink/GoogleLink'
import { Typography } from 'components/common/Typography'
import { AxiosError } from 'axios'
import { errorOccurred } from 'redux/slice/error/error.slice'

type PropsLoginForm = {
  toggleFunction?: React.MouseEventHandler<HTMLButtonElement>
}

const LoginForm: React.FC<PropsLoginForm> = ({ toggleFunction }: any) => {
  const dispatch = useAppDispatch()
  const { isVerify } = useAppSelector((state) => state.authSlice)

  const clickButton = useCallback((loginData: any) => {
    try {
      dispatch(fetchLogin(loginData))
    } catch (error) {
      console.log(error)
    }
  }, [])

  return (
    <div className=" px-10">
      {!isVerify ? (
        <div className="p-4" style={{ margin: 'auto', width: '100%' }}>
          <h1 className="text-3xl font-semibold text-center mb-10">Sign in</h1>
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validateOnBlur
            onSubmit={(loginData) => clickButton(loginData)}
            validationSchema={validationsSchemaLogin}
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
                      style={{
                        margin: '0',
                        position: 'relative',
                        bottom: '12px',
                      }}
                    >
                      {errors.email}
                    </p>
                  )}

                  <div>
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
                      style={{
                        marginTop: '13px',
                        position: 'relative',
                        bottom: '12px',
                      }}
                    >
                      {errors.password}
                    </p>
                  )}

                  <div className="flex items-center justify-end mt-1">
                    <Link
                      className="inline-block align-baseline font-bold text-sm  text-green-dark opacity-50 hover:opacity-100"
                      to={AppRoute.FORGOT_PASSWORD}
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <div className="flex flex-col items-start justify-center w-full mt-8 ">
                    <Button
                      type={'submit'}
                      btnName={'primary'}
                      label={'Sign in'}
                      disabled={!isValid && !dirty}
                      className="w-full m-0"
                    >
                      Login
                    </Button>
                  </div>

                  <div className="flex flex-col justify-center items-center w-full gap-3 mt-5">
                    <GoogleButton />
                  </div>
                  <div className="mt-5">
                    <GoogleLink type={'sign-up'} to={AppRoute.SIGN_UP} />
                  </div>
                </Form>
              </div>
            )}
          </Formik>
        </div>
      ) : (
        <CheckCode verifyCodeAuth={verifyCodeAuth} />
      )}
    </div>
  )
}

export default LoginForm
