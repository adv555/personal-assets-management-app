import React from 'react'
import PhoneNumberInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import clsx from 'clsx'
import { Typography } from '../Typography'

export type PhoneInputProps = {
  name: string
  placeholder: string
  type: string
  label?: string
  value?: string
  error?: string | React.ReactNode
  setFieldValue?: (field: string, value: any, shouldValidate?: boolean) => void
}

export const PhoneInput = ({
  name,
  label,
  type,
  error,
  setFieldValue,

  ...inputProps
}: PhoneInputProps) => {
  const borderStyle = error ? 'border-error' : 'border-green-light'

  return (
    <div className={'flex flex-col sm:w-1/2  gap-1'}>
      <label htmlFor={name}>
        <Typography type={'Ag-14-regular'}>{label}</Typography>
      </label>

      <div className="">
        <PhoneNumberInput
          className={clsx(
            'form-input py-0 pr-0 rounded-lg border-green-light text-green-dark opacity-70 focus:border focus:border-lime-500 hover:border hover:border-lime-500 ',
            borderStyle,
          )}
          name={name}
          type={type}
          international
          initialValueFormat="national"
          defaultCountry="UA"
          onChange={(val: string) => {
            setFieldValue && setFieldValue(name, val || '', true)
          }}
          {...inputProps}
        />
      </div>
      {!!error && (
        <div className="text-sm text-error">
          <Typography type={'Ag-14-regular'}>{error}</Typography>
        </div>
      )}
    </div>
  )
}
