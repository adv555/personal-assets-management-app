import React from 'react'
import { Typography } from 'components/common/Typography'
import { Button } from 'components/common/buttons/Button'

interface SectionTitleProps {
  title: string
  subTitle?: string
  iconLabel?: string
  icon?: React.ReactNode
  onClick?: () => void
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subTitle,
  icon,
  iconLabel,
  onClick,
}) => {
  return (
    <div className="flex flex-row items-center justify-between">
      <div>
        <Typography type={'h4'}>{title}</Typography>
        <Typography type={'Ag-14-regular'}>{subTitle || ''}</Typography>
      </div>
      {icon && (
        <div>
          <Button
            label={iconLabel || ''}
            type={'button'}
            btnName={'tertiary2'}
            icon={icon}
            onClick={onClick}
          />
        </div>
      )}
    </div>
  )
}
