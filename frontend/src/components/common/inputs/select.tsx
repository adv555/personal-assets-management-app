import React from 'react'
import { Typography } from 'components/common/Typography'
import clsx from 'clsx'

interface IOption {
  value: number | string
  name: string
}

export interface SelectProps extends React.HTMLProps<HTMLInputElement> {
  className?: string
  label?: string
  type: 'select'
  name: string
  isInvalid?: boolean
  error?: string
  value?: string | number
  onChange?: any
  optionArray: IOption[]
}

export const Select: React.FC<SelectProps> = ({
  label,
  type,
  name,
  error,
  isInvalid,
  className,
  value,
  onChange,
  optionArray,
  ...SelectProps
}) => {
  const borderStyle = isInvalid ? 'border-error' : 'border-green-light'

  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      <label htmlFor={name}>
        <Typography type={'Ag-14-regular'}>{label}</Typography>
      </label>

      <select
        id="countries"
        name={name}
        value={value}
        onChange={onChange}
        className={` p-3 form-input rounded-lg min-w-full text-base font-medium text-green-dark placeholder:italic placeholder:text-slate-400 placeholder:text-sm placeholder:font-medium  opacity-70  focus:border-2 focus:border-lime-500 focus:ring-0 ${borderStyle}`}
      >
        {optionArray.map((row) => {
          return (
            <option key={row.value} value={row.value}>
              {row.name}
            </option>
          )
        })}
      </select>

      {isInvalid && error && (
        <div className="text-sm text-error">
          <Typography type={'Ag-14-regular'}>{error}</Typography>
        </div>
      )}
    </div>
  )
}
