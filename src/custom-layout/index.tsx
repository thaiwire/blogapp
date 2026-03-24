'use client'
import { usePathname } from 'next/navigation'
import React, { use } from 'react'
import PrivateLayout from './private-layout';

function CustomLayout({children}: {children: React.ReactNode}) {
  
  const pathname = usePathname();
  if (pathname.startsWith("/user")) {
     return <PrivateLayout>{children}</PrivateLayout>;
  }
  
  return (
    <div>{children}</div>
  )
}

export default CustomLayout