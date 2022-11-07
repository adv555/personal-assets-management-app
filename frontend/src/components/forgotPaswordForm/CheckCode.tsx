import { AppRoute } from 'common/enums/app-route.enum'
import { Button } from 'components/common/buttons/Button'
import { Typography } from 'components/common/Typography'
import { Form, Formik } from 'formik'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { toggleSendAuthMessage } from 'redux/slice/authSlice'
import { getPermission } from 'redux/slice/refreshPasswordSlice'
import {
  checkEmailAndSendCode,
  checkEmailAndSendCodeAgain,
  verifyCode,
} from 'redux/thunk/authThunk'
import InputUI from 'ui/input/InputUI'
import * as yup from 'yup'
import ChangePassword from './ChangePassword'
import { validationsSchemaCheckCode } from './schemaForgotPassword/ValidationSchemaForgotPassword'
import Taimer from './Taimer'
import { checkEmailAndSendCodeAgainForAuth } from '../../redux/thunk/authThunk'
/*eslint-disable */
type PropsCheckCode = {
  verifyCodeAuth?: any
}
const CheckCode: React.FC<PropsCheckCode> = ({ verifyCodeAuth }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isVerify, isAuth, sendAuthMessage } = useAppSelector(
    (state) => state.authSlice,
  )
  const [toggleTimer, setToggleTimer] = React.useState(false)
  const resetTimer = () => {
    setTimeout(() => {
      setToggleTimer(false)
    }, 1000 * 60)

    setToggleTimer(true)
  }
  const { permission, statusRefreshSlice, statusCode, codeWillBySend } =
    useAppSelector((state) => state.refreshPasswordSlice)
  const [value, setValue] = React.useState('')

  React.useEffect(() => {
    if (statusCode && statusCode < 202) {
      if (isVerify && sendAuthMessage === false) {
        try {
          dispatch(checkEmailAndSendCodeAgain())
          resetTimer()
        } catch (e) {
          console.log(e)
        }
      }
    }
    if (codeWillBySend) {
      resetTimer()
    }
  }, [])

  const clickButton = React.useCallback(async (loginData: any, e: any) => {
    try {
      if (verifyCodeAuth) {
        await dispatch(verifyCodeAuth(loginData))

        navigate('/')
      }
      if (!verifyCodeAuth) {
        await dispatch(verifyCode(loginData))
      }
    } catch (error) {
      console.log(error)
    }
  }, [])

  const clickButtonForAuth = React.useCallback(() => {
    if (verifyCodeAuth) {
      dispatch(checkEmailAndSendCodeAgainForAuth())
    }

    if (!verifyCodeAuth) {
      dispatch(checkEmailAndSendCodeAgain())
    }
    resetTimer()
  }, [verifyCodeAuth])

  const goHome = () => {
    navigate(AppRoute.HOME)

    location.reload()
  }
  const newClickButton = async (loginData: any) => {
    try {
      if (verifyCodeAuth) {
        await dispatch(verifyCodeAuth(loginData))
        navigate('/')
        return true
      }
      if (!verifyCodeAuth) {
        await dispatch(verifyCode(loginData))
      }
    } catch (error) {
      console.log(error)
      return false
    }
    return false
  }

  return (
    <div>
      {!permission ? (
        <>
          <h1 className="text-3xl font-semibold text-center mb-20">
            Confirmation CODE
          </h1>

          <Formik
            initialValues={{
              code: '',
            }}
            validateOnBlur
            onSubmit={async (value, { setSubmitting, resetForm }) => {
              const res = await newClickButton(value)
              if (res) {
                setSubmitting(true)
              } else {
                console.log('error')
              }
            }}
            validationSchema={validationsSchemaCheckCode}
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
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <div className="flex justify-between	items-center	">
                    <label
                      className="block text-gray-700 text-xl font-medium mb-5"
                      htmlFor="username"
                    >
                      Confirmation CODE has been sent to the mail
                    </label>
                    {toggleTimer && <Taimer />}
                  </div>
                  <InputUI
                    type={'text'}
                    name={'code'}
                    placeholder={'Code...'}
                    value={values.code}
                    setValue={handleChange}
                    onBlur={handleBlur}
                    error={touched.code && errors.code ? false : true}
                  ></InputUI>
                </div>
                {touched.code && errors.code && (
                  <p
                    className="text-red-600 italic text-sm"
                    style={{
                      margin: '0',
                      position: 'relative',
                      bottom: '12px',
                    }}
                  >
                    {errors.code}
                  </p>
                )}
                {!toggleTimer && (
                  <Typography
                    onClick={() => clickButtonForAuth()}
                    type={'Ag-14-medium'}
                    children={'Send again '}
                    className={
                      'px-3 bg-lime-400 text-white cursor-pointer rounded-md w-max	 '
                    }
                  ></Typography>
                )}
                <div className="flex">
                  <Button
                    type={'button'}
                    onClick={() => goHome()}
                    btnName={'primary'}
                    label={'Back'}
                    className={'m-1 mt-10'}
                  ></Button>

                  <Button
                    disabled={!isValid && !dirty}
                    type={'submit'}
                    btnName={'primary'}
                    label={'Send'}
                    className={'m-1 mt-10'}
                  >
                    Login
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </>
      ) : (
        <ChangePassword />
      )}
    </div>
  )
}
/*eslint-enable */

export default CheckCode
