import React from 'react'
import { Typography } from 'components/common/Typography'

interface TitleProps {
  title: string
}

export const Title: React.FC<TitleProps> = ({ title }) => {
  return <Typography type={'h1'}>{title}</Typography>
}
