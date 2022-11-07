import React, { useEffect } from 'react'

interface ModalContainerProps {
  showModal: boolean
  onClose: () => void
  children: React.ReactNode
}

export const ModalContainer: React.FC<ModalContainerProps> = ({
  showModal,
  onClose,
  children,
}) => {
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

  return (
    <div
      className={`absolute inset-0 z-10 flex items-center justify-center  ${
        showModal ? '' : 'pointer-events-none'
      } `}
    >
      {/* backdrop */}
      <div
        className={`absolute inset-0 bg-green-dark border rounded ${
          showModal ? 'opacity-50' : 'pointer-events-none opacity-0'
        } `}
        onClick={onClose}
      />

      {/* content */}
      <div
        className={`absolute h-50 lg:w-2/3 bg-gray-ultralight shadow-lg p-3 rounded-xl flex flex-col justify-center items-center ${
          showModal ? 'opacity-100' : 'pointer-events-none opacity-0'
        } transition-opacity duration-300 ease-in-out`}
      >
        {children}
      </div>
    </div>
  )
}
