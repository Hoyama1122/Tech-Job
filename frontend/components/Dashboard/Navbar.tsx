"use client";

import { Search } from "lucide-react";
import RightNavbar from "./RightNavbar";



const Navbar = () => {
  return (
    <div className="bg-[#F5F5F5] shadow-lg px-6 py-4 sticky top-0">
      <div className="flex items-center justify-between gap-4">
        {/* Title */}
        <div className="w-1/4">
          <div className="">
            
          </div>
        </div>
        {/* Right Side */}
        <RightNavbar />
      </div>
    </div>
  );
};

export default Navbar;
