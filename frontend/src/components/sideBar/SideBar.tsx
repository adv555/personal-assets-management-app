import React, { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import MenuItem from './MenuItem'
import { Typography } from '../common/Typography/Typography'
import LogoutButton from '../common/buttons/LogoutButton'

import { AppRoute } from 'common/enums/app-route.enum'
import clsx from 'clsx'
import { useAppDispatch } from 'hooks/useAppDispatch'
import { Logout } from 'redux/thunk/authThunk'
import { resetUserProfileStore } from 'redux/slice/userProfile/actionCreators'

interface MenuStructureItem {
  title: string
  link: string
  icon: ReactNode | string | null
}

interface SideBarProps {
  logoLink: string
  structure: MenuStructureItem[]
  screen: 'desktop' | 'mobile'
}

const STYLES = {
  desktop: 'hidden md:block',
  mobile: 'block md:hidden',
}

export const SideBar: React.FC<SideBarProps> = ({
  logoLink,
  structure,
  screen,
}) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const logoutClick = React.useCallback(() => {
    try {
      dispatch(Logout())
      dispatch(resetUserProfileStore())
      navigate(AppRoute.HOME)
    } catch (e) {
      console.log(e, 'error with logout')
    }
  }, [])

  return (
    <div
      className={clsx(
        'sticky top-0  bg-gray-ultralight  px-6 pt-7 h-screen md:max-w-[274px] w-full ',
        STYLES[screen],
      )}
    >
      <Link to={logoLink} className="block w-[145px] h-[42px] mb-10">
        <Typography type={'h1'}>{'MyFinance'}</Typography>
      </Link>

      <nav className="flex flex-col justify-between h-5/6">
        <div>
          {structure.map(({ link, title, icon }) => (
            <MenuItem
              key={'/portal' + link}
              link={link}
              label={title}
              icon={icon}
            />
          ))}
        </div>
        <div className="pl-4 text-gray  hover:text-gray-dark fill-gray hover:fill-gray-dark transition">
          <LogoutButton onClick={() => logoutClick()} />
        </div>
      </nav>
    </div>
  )
}
