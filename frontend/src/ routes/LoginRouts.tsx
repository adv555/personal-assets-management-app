import { AppRoute } from 'common/enums/app-route.enum'
import CheckCode from 'components/forgotPaswordForm/CheckCode'
import ForgotPassword from 'components/forgotPaswordForm/ForgotPassword'
import LoginForm from 'components/loginForm/LoginForm'
import RegisterForm from 'components/registerForm/RegisterForm'
import LoginPage from 'pages/login/LoginPage'
import NotFoundPage from 'pages/NotFoundPage'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const LoginRouts = () => {
  return (
    <div>
      <Routes>
        <Route path={AppRoute.HOME} element={<LoginPage />}>
          <Route index element={<LoginForm />} />
          <Route path={AppRoute.SIGN_IN} element={<LoginForm />} />
          <Route path={AppRoute.SIGN_UP} element={<RegisterForm />} />
          <Route path={AppRoute.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={AppRoute.VERIFY_CODE} element={<CheckCode />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}

export default LoginRouts
