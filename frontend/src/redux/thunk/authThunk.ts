import api, { apiCreden } from './../../axios/axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { stat } from 'fs'
import { Console } from 'console'
import { AxiosError } from 'axios'

export const fetchLogin = createAsyncThunk(
  'users/fetchById',
  async (params: any, { rejectWithValue }) => {
    try {
      const { data, status } = await api.post('/auth/login', params)

      sessionStorage.setItem('emailVerify', params.email)
      sessionStorage.setItem('password', params.password)

      return { data, status }
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message)
      }
    }
  },
)

export const Registration = createAsyncThunk(
  'users/fetchRegistration',
  async (params: any, { rejectWithValue }): Promise<any> => {
    try {
      const data = await api.post('auth/register', params)

      return data.data
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message)
      }
    }
  },
)

export const Logout = createAsyncThunk('users/fetchLogout', async () => {
  const { data } = await api.post('/auth/logout')

  window.localStorage.removeItem('token')

  return data
})

export const GetAllUsers = createAsyncThunk('users/fetchAll', async () => {
  const { data } = await api.get('users')

  return data
})

export const checkAuth = createAsyncThunk('users/check', async () => {
  const { data, status } = await apiCreden.post(`auth/refresh`)

  return { data, status }
})

export const authWithGoogle = createAsyncThunk(
  'users/google',
  async (credentialResponse: object, { rejectWithValue }) => {
    try {
      const { data } = await apiCreden.post('auth/google/auth', {
        token: credentialResponse,
      })

      return data
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message)
      }
    }
  },
)

export const checkEmailAndSendCode = createAsyncThunk(
  'users/checkEmailAndSendCode',
  async (params: any, { rejectWithValue }): Promise<any> => {
    try {
      const { data, status } = await apiCreden.post(
        'auth/forgotPassword',
        params,
      )

      return { data, status, params }
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message)
      }
    }
  },
)
export const checkEmailAndSendCodeAgain = createAsyncThunk(
  'users/checkEmailAndSendCodeAgain',
  async (_, { rejectWithValue }): Promise<any> => {
    const email = sessionStorage.getItem('emailVerify')
      ? sessionStorage.getItem('emailVerify')
      : sessionStorage.getItem('email')

    try {
      const { data, status } = await apiCreden.post('auth/forgotPassword', {
        email: email,
      })

      return { data, status }
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message)
      }
    }
  },
)

export const checkEmailAndSendCodeAgainForAuth = createAsyncThunk(
  'users/checkEmailAndSendCodeAgain',
  async (_, { rejectWithValue }): Promise<any> => {
    const email = sessionStorage.getItem('emailVerify')
      ? sessionStorage.getItem('emailVerify')
      : sessionStorage.getItem('email')

    try {
      const { data, status } = await apiCreden.post(
        'auth/generateCodeForAuth',
        {
          email: email,
        },
      )

      return { data, status }
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message)
      }
    }
  },
)

export const verifyCodeForAuth = createAsyncThunk(
  'users/verifyCode',
  async (params: any, { rejectWithValue }): Promise<any> => {
    const email = sessionStorage.getItem('email')
      ? sessionStorage.getItem('email')
      : sessionStorage.getItem('emailVerify')
    const { code } = params
    const codeString = code.toString()

    try {
      const { data, status } = await apiCreden.post('auth/verifyCodeForAuth', {
        email,
        code: codeString,
      })

      return { statusCode: status }
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message)
      }
    }
  },
)

export const verifyCode = createAsyncThunk(
  'users/verifyCode',
  async (params: any, { rejectWithValue }): Promise<any> => {
    const email = sessionStorage.getItem('email')
      ? sessionStorage.getItem('email')
      : sessionStorage.getItem('emailVerify')
    const { code } = params
    const codeString = code.toString()

    try {
      const { data, status } = await apiCreden.post('auth/verifyCode', {
        email,
        code: codeString,
      })

      return { statusCode: status }
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message)
      }
    }
  },
)

export const refreshPassword = createAsyncThunk(
  'users/refreshPassword',
  async (params: any, { rejectWithValue }): Promise<any> => {
    const email =
      sessionStorage.getItem('email') && sessionStorage.getItem('email')

    try {
      const { status } = await apiCreden.patch('auth/refreshPassword', {
        email,
        password: params,
      })

      return status
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message)
      }
    }
  },
)

export const verifyCodeAuth = createAsyncThunk(
  'users/verifyCodeAuth',
  async (params: any, { rejectWithValue }): Promise<any> => {
    const email =
      sessionStorage.getItem('emailVerify') &&
      sessionStorage.getItem('emailVerify')
    const password = sessionStorage.getItem('password')
    const { code } = params
    const codeString = code.toString()

    try {
      const { data, status } = await api.post('auth/login/verify', {
        email: email,
        password: password,
        code: codeString,
      })

      return { data, status }
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message)
      }
    }
  },
)
