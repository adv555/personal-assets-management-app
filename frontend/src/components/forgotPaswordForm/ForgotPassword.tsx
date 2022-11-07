import { AppRoute } from 'common/enums/app-route.enum'
import { Button } from 'components/common/buttons/Button'
import { Form, Formik } from 'formik'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { checkEmailAndSendCode } from 'redux/thunk/authThunk'
import InputUI from 'ui/input/InputUI'
import { validationsSchemaForgotPassword } from './schemaForgotPassword/ValidationSchemaForgotPassword'

const ForgotPassword = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { statusRefreshSlice, statusCode } = useAppSelector(
    (state) => state.refreshPasswordSlice,
  )

  React.useEffect(() => {
    if (statusCode === 201) {
      return navigate(`/${AppRoute.VERIFY_CODE}`)
    }

    return console.log('Error')
  }, [statusCode])

  const clickButton = React.useCallback(async (loginData: any) => {
    try {
      await dispatch(checkEmailAndSendCode(loginData))
    } catch (error) {
      console.log(error)
    }
  }, [])

  return (
    <>
      <h1 className="text-3xl font-semibold text-center mb-10">
        Password change
      </h1>

      <Formik
        initialValues={{
          email: '',
        }}
        validateOnBlur
        onSubmit={(loginData) => clickButton(loginData)}
        validationSchema={validationsSchemaForgotPassword}
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
                Pleas write your email
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
            <div className="flex">
              <Link to={AppRoute.HOME} className={'w-1/2 mx-2'}>
                <Button
                  type={'button'}
                  btnName={'primary'}
                  label={'Back'}
                ></Button>
              </Link>
              <Button
                type={'submit'}
                btnName={'primary'}
                label={'Send'}
                className={'w-1/2 m-2'}
              ></Button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default ForgotPassword
