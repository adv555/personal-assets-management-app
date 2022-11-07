import React from 'react'
import { Link } from 'react-router-dom'
import { Typography } from '../Typography/Typography'
import { ReactComponent as SignInIcon } from 'assets/icons/sign-in.svg'
import { ReactComponent as SignUpIcon } from 'assets/icons/sign-up.svg'

interface GoogleLinkProps {
  type: 'sign-in' | 'sign-up'
  to: string
}

export const GoogleLink: React.FC<GoogleLinkProps> = ({ type, to }) => {
  return (
    <>
      <div className="flex flex-row items-center justify-center ">
        <Typography type={'Ag-14-medium'} className="text-text-ultralight">
          {type === 'sign-up' && 'Don’t have an account?'}
          {type === 'sign-in' && 'Already have an account?'}
        </Typography>

        <div className="relative">
          <Typography type={'Ag-14-medium'} className="ml-2 ">
            <Link to={to}>
              {type === 'sign-in' && 'Sign in'}
              {type === 'sign-up' && 'Sign up for free'}
            </Link>
          </Typography>
          <div className=" left-0 right-0 absolute ">
            {type === 'sign-in' && <SignInIcon />}
            {type === 'sign-up' && <SignUpIcon />}
          </div>
        </div>
      </div>
    </>
  )
}
