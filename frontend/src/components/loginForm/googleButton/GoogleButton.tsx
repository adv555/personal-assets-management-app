import React, { useCallback } from 'react'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { authWithGoogle } from 'redux/thunk/authThunk'

const GoogleButton = (props: any) => {
  const dispatch = useAppDispatch()

  const googleAuth = useCallback((el: any) => {
    dispatch(authWithGoogle(el))
  }, [])

  return (
    <>
      <GoogleOAuthProvider clientId={`${process.env.REACT_APP_API_GOOGLE_ID}`}>
        <GoogleLogin
          onSuccess={(credentialResponse) =>
            googleAuth(credentialResponse.credential)
          }
          type="standard"
          onError={() => {
            console.log('Login Failed')
          }}
          theme="filled_black"
        />
      </GoogleOAuthProvider>
    </>
  )
}

export default GoogleButton
