import React from 'react'
import RightNavbar from './RightNavbarTech'

const NavbarTech = () => {
  return (
   <div className="bg-[#29335C] shadow-lg px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between gap-4">
        {/* Title */}
        <div className="w-1/4 hidden md:block">
          <div className=""></div>
        </div>
        <div></div>
        {/* Right Side */}
        <RightNavbar />
      </div>
    </div>
  )
}

export default NavbarTech