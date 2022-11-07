import React from 'react'
import styles from './InputUi.module.scss'

type inputProps = {
  type?: string
  placeholder?: string
  value?: string
  setValue?: any
  onBlur?: any
  name?: string
  error?: boolean
  style?: any
  onChange?: any
}

const InputUI: React.FC<inputProps> = ({
  type = 'text',
  placeholder = 'text',
  value,
  setValue,
  onBlur,
  name,
  error = true,
  style,
  onChange,
}) => {
  return (
    <div>
      <input
        className={`placeholder:opacity-50 text-sm ${
          error ? styles.input : styles.inputError
        }`}
        type={type}
        value={value}
        onChange={setValue ? setValue : (e) => onChange(e.target.value)}
        placeholder={placeholder}
        onBlur={onBlur}
        name={name}
        style={style}
      />
    </div>
  )
}

export default InputUI
