import React from 'react'
import { Typography } from 'components/common/Typography'
import clsx from 'clsx'

export interface InputProps extends React.HTMLProps<HTMLInputElement> {
  className?: string
  label?: string
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'search'
  name: string
  placeholder?: string
  disabled?: boolean
  isInvalid?: boolean
  error?: string
  value?: string | number
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Input: React.FC<InputProps> = ({
  label,
  type,
  name,
  error,
  isInvalid,
  className,
  value,
  onChange,
  ...inputProps
}) => {
  const borderStyle = isInvalid ? 'border-error' : 'border-green-light'

  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      <label htmlFor={name}>
        <Typography type={'Ag-14-regular'}>{label}</Typography>
      </label>

      <input
        className={`form-input rounded-lg min-w-full text-base font-medium text-green-dark placeholder:italic placeholder:text-slate-400 placeholder:text-sm placeholder:font-medium  opacity-70  focus:border focus:border-lime-500 focus:ring-0 hover:border hover:border-lime-500 ${borderStyle}`}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        {...inputProps}
      />

      {isInvalid && error && (
        <div className="text-sm text-error">
          <Typography type={'Ag-14-regular'}>{error}</Typography>
        </div>
      )}
    </div>
  )
}
