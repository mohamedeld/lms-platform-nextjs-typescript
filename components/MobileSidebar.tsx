"use client";

import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import Sidebar from './Sidebar'

const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger className='md:hidden pr-4 hover:opacity-75 transition'>
        <Menu/>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white">
        <SheetHeader>
      <SheetTitle></SheetTitle>
      </SheetHeader>
        <Sidebar/>
      </SheetContent>
    </Sheet>
  )
}

export default MobileSidebar