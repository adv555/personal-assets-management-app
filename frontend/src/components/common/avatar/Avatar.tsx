import React from 'react'
import clsx from 'clsx'
import { ReactComponent as ProfileIcon } from 'assets/icons/profile.svg'
import { AVATAR_STYLES, AVATAR_PLACEHOLDER_STYLES } from './Avatar.style'
import { CONSTANTS } from 'shared/constants'

interface AvatarProps {
  img: string | null | undefined
  alt?: string
  avatarType: 'upload' | 'profile' | 'channel' | 'message'
}

export const Avatar = ({ img, alt, avatarType }: AvatarProps) => {
  const conditions = ['googleusercontent', 'blob:']

  return (
    <>
      {img && avatarType ? (
        <div className={clsx(AVATAR_STYLES[avatarType])}>
          <img
            src={
              conditions.some((condition) => img.includes(condition))
                ? img
                : `${CONSTANTS.CLOUDINARY_FILE_STORAGE}${img}`
            }
            alt={alt || 'user avatar'}
            title="user avatar"
            className={`w-full h-full ${
              avatarType === 'message' && 'object-contain'
            }`}
          />
        </div>
      ) : (
        <ProfileIcon
          className={clsx(AVATAR_PLACEHOLDER_STYLES[avatarType])}
          title="user avatar"
        />
      )}
    </>
  )
}
