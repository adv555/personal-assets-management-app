import React from 'react'
import { useField } from 'formik'
import { Input, InputProps } from './Input'

type InputFieldProps = Omit<InputProps, 'isInvalid' | 'error'>

export const InputField: React.FC<InputFieldProps> = ({ name, ...rest }) => {
  const [field, meta] = useField(name)

  return (
    <Input
      {...field}
      {...rest}
      isInvalid={!!meta.error && !!meta.touched}
      error={String(meta.error)}
    />
  )
}
