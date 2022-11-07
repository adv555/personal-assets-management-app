/* eslint-disable @typescript-eslint/no-empty-function */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IUserProfile {
  id?: number | string
  firstName: string
  lastName: string
  email: string
  address: string | null
  phone: string | null
  birthdate: string | null
  avatarPath?: string | null
  password?: string
}

const initialState: IUserProfile = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  phone: '',
  birthdate: '',
  avatarPath: '',
}

export const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    getUserSuccess: (state, action: PayloadAction<IUserProfile>) => ({
      ...state,
      ...action.payload,
    }),
    getUserFailure: () => ({ ...initialState }),
    updateUserSuccess: (state, action: PayloadAction<IUserProfile>) => ({
      ...state,
      ...action.payload,
    }),
    updateUserFail: () => {},
    removeUserSuccess: () => ({ ...initialState }),
    resetUserProfile: () => ({ ...initialState }),
  },
})

export const {
  getUserSuccess,
  getUserFailure,
  updateUserSuccess,
  updateUserFail,
  removeUserSuccess,
  resetUserProfile,
} = userProfileSlice.actions

export default userProfileSlice.reducer
