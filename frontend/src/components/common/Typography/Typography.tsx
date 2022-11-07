import clsx from 'clsx'
import React from 'react'
import { TypographyStyle } from './Typography.style'

interface TypographyProps {
  type: keyof typeof TypographyStyle
  className?: string
  tagName?: string
  children: React.ReactNode
  onClick?: () => void
}

export const Typography: React.FC<TypographyProps> = ({
  type,
  className,
  tagName,
  children,
  onClick,
}) => {
  const Tag = (tagName ||
    TypographyStyle[type].defaultTagName) as keyof JSX.IntrinsicElements
  const predefinedClassName = TypographyStyle[type].className

  return (
    <Tag className={clsx(predefinedClassName, className)} onClick={onClick}>
      {children}
    </Tag>
  )
}
