import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}
export const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  function escHandler(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      onClose()
    }
  }

  useEffect(() => {
    window?.addEventListener('keydown', escHandler)

    return () => {
      window?.removeEventListener('keydown', escHandler)
    }
  }, [])

  if (typeof document !== 'undefined') {
    return createPortal(
      <div
        className={`block fixed inset-0 z-10 ${
          open ? '' : 'pointer-events-none'
        } md:hidden`}
      >
        {/* backdrop */}
        <div
          className={`fixed inset-0 bg-green-dark ${
            open ? 'opacity-50' : 'pointer-events-none opacity-0'
          } `}
          onClick={onClose}
        />

        {/* content */}
        <div
          className={`fixed left-0 h-full bg-gray-ultralight shadow-lg w-1/2 min-w-[280px] max-w-screen-sm pl-9 pt-6 pb-10 pr-12 ${
            open ? 'opacity-100' : 'pointer-events-none opacity-0'
          } transition-opacity duration-300 ease-in-out`}
        >
          {children}
        </div>
      </div>,
      document.body,
    )
  } else {
    return null
  }
}
