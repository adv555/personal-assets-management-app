import { Typography } from 'components/common/Typography'
import React from 'react'
import { Link } from 'react-router-dom'

interface LogoProps {
  logoLink?: string
  size: 'mobile' | 'desktop'
  onClick?: () => void
}

export const Logo: React.FC<LogoProps> = ({ logoLink, size, onClick }) => {
  return (
    <>
      {size === 'mobile' && (
        <div onClick={onClick}>
          <Typography type={'h1'}>{'MyFinance'}</Typography>
        </div>
      )}
      {size === 'desktop' && (
        <Link to={logoLink || ''} className="block w-[145px] h-[42px] mb-10">
          <Typography type={'h1'}>{'MyFinance'}</Typography>
        </Link>
      )}
    </>
  )
}
