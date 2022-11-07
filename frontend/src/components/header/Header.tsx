import React, { useState } from 'react'
import { Typography } from 'components/common/Typography'
import { useLocation } from 'react-router-dom'
import { Logo } from './Logo/Logo'
import { AvatarForm } from './AvatarUploadButton/AvatarForm'
import { Modal } from 'components/sideBar/Modal/Modal'
import { SideBar } from 'components/sideBar/SideBar'
import { menuStructure } from 'pages/PortalPage'
import { AppRoute } from 'common/enums/app-route.enum'
import { ReactComponent as MenuIcon } from 'assets/icons/menu.svg'

export const Header: React.FC = () => {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const linksLocation = location.pathname?.split('/')
  const title = parseInt(linksLocation[linksLocation.length - 1])
    ? linksLocation[linksLocation.length - 2]?.replace(/-/g, ' ')
    : linksLocation[linksLocation.length - 1]?.replace(/-/g, ' ')

  return (
    <>
      <header className="sticky w-full h-[90px] flex justify-between items-center py-6 px-11 pl-9 border-b border-b-neutral-200">
        <div>
          <div
            className="flex justify-center items-center gap-3 md:hidden"
            onClick={() => setOpen(true)}
          >
            <MenuIcon className="w-10 h-10" />
            <Logo size={'mobile'} />
          </div>
          <div className="hidden md:block">
            <Typography type={'h2'} className=" capitalize">
              {title}
            </Typography>
          </div>
        </div>
        <div className="flex items-center ml-auto">
          <AvatarForm />
        </div>
      </header>
      <Modal onClose={() => setOpen(false)} open={open}>
        <SideBar
          logoLink={AppRoute.DASHBOARD}
          structure={menuStructure}
          screen="mobile"
        />
      </Modal>
    </>
  )
}
