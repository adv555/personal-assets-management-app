import React from 'react'
import clsx from 'clsx'
import { Typography } from 'components/common/Typography'

interface ICurrencyButtonProps {
  children: React.ReactNode | React.ReactNode[]
  onClick?: () => void
  isActive?: boolean
  className?: string
  [x: string]: any
}

const HeaderButton = ({
  onClick,
  children,
  isActive,
  className,
  ...props
}: ICurrencyButtonProps) => {
  return (
    <button
      type="button"
      {...props}
      className={clsx(
        'flex justify-center items-center text-center text-base text-Ag-14 font-medium box-border transition duration-200 cursor-pointer py-1.5 px-2 text-gray-800 dark:text-gray-200',
        isActive && 'underline cursor-default pointer-events-none',
        isActive || 'cursor-pointer hover:text-green',
        className,
      )}
      onClick={() => (onClick ? onClick() : null)}
    >
      {children}
    </button>
  )
}

export default HeaderButton
