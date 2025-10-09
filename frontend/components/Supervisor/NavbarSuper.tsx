"use client";

import { Search } from "lucide-react";
import RightNavbar from "./RightNavbarSuper";


const Navbar = () => {
  return (
    <div className="bg-[#F5F5F5] shadow-lg px-6 py-4 sticky top-0">
      <div className="flex items-center justify-between gap-4">
        {/* Title */}
        <div className="w-1/4">
          <div className="">
            <div className="bg-gray-100 shadow-2xl rounded-xl gap-2 px-4 py-2 flex items-center border-2 border-gray-300 text-lg">
              <Search size={24} className="text-gray-500"/>
              <input type="text" className="w-full  focus:outline-none" placeholder="ค้นหาใบงาน"/>
              <div className="bg-primary-test rounded px-3 py-1">
                <p className="text-white text-sm cursor-pointer">ค้นหา</p>
              </div>
            </div>
          </div>
        </div>
        {/* Right Side */}
        <RightNavbar />
      </div>
    </div>
  );
};

export default Navbar;
