import { AppRoute } from 'common/enums/app-route.enum'
import { Button } from 'components/common/buttons/Button'
import { passwordRules } from 'components/registerForm/schemasAuth/ValidationSchemaAuth'
import { Form, Formik } from 'formik'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { checkEmailAndSendCode, refreshPassword } from 'redux/thunk/authThunk'
import InputUI from 'ui/input/InputUI'
import * as yup from 'yup'
import ChangedSuccessfully from './ChangedSuccessfully'
import { validationsSchemaChangePassword } from './schemaForgotPassword/ValidationSchemaForgotPassword'

const ChangePassword = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { statusCode } = useAppSelector((state) => state.refreshPasswordSlice)
  const [successful, setSuccessful] = React.useState(false)

  React.useEffect(() => {
    if (statusCode === 202) {
      setSuccessful(true)
    }
  }, [statusCode])

  const clickButton = React.useCallback((loginData: any) => {
    try {
      dispatch(refreshPassword(loginData.password))
    } catch (error) {
      console.log(error)
    }
  }, [])

  const goHome = () => {
    navigate(AppRoute.HOME)

    location.reload()
  }

  return (
    <div>
      {!successful ? (
        <>
          <h1 className="text-3xl font-semibold text-center mb-10">Sing in</h1>

          <Formik
            initialValues={{
              password: '',
              confirmPassword: '',
            }}
            validateOnBlur
            onSubmit={(loginData) => clickButton(loginData)}
            validationSchema={validationsSchemaChangePassword}
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
              <Form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-xl font-medium mb-2"
                    htmlFor="username"
                  >
                    Password
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
                      margin: '0',
                      position: 'relative',
                      bottom: '12px',
                    }}
                  >
                    {errors.password}
                  </p>
                )}

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-xl font-medium mb-2"
                    htmlFor="username"
                  >
                    Confirm password
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
                    style={{
                      margin: '0',
                      position: 'relative',
                      bottom: '12px',
                    }}
                  >
                    {errors.confirmPassword}
                  </span>
                )}
                <div className="flex">
                  <Button
                    type={'button'}
                    btnName={'primary'}
                    label={'Back'}
                    className={'w-1/2 mx-2'}
                    onClick={() => goHome()}
                  ></Button>

                  <Button
                    type={'submit'}
                    btnName={'primary'}
                    label={'Send'}
                    disabled={!isValid && !dirty}
                    onClick={() => setSuccessful(false)}
                  >
                    Login
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </>
      ) : (
        <ChangedSuccessfully />
      )}
    </div>
  )
}

export default ChangePassword
