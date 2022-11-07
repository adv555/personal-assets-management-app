import React from 'react'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col justify-start p-1 overflow-y-auto h-5/6 relative md:p-10">
      {children}
    </div>
  )
}
