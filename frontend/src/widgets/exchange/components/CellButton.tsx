import React, { MouseEventHandler, ReactNode } from 'react'
import clsx from 'clsx'

interface ICellButton {
  children: ReactNode | ReactNode[]
  onClick?: MouseEventHandler
  className?: string
}

const CellButton = ({ onClick, className, children }: ICellButton) => {
  return (
    <button
      className={clsx(
        'text-Ag-16 font-semibold transition duration-200 hover:text-green',
        className,
      )}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default CellButton
