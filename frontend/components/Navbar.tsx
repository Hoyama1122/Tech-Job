"use client";

import RightNavbar from "./Dashboard/RightNavbar";

const Navbar = () => {
  return (
    <div className="bg-[#F5F5F5] shadow-lg px-6 py-4 sticky top-0">
      <div className="flex items-center justify-between gap-4">
        {/* Title */}
        <div className="flex-1 max-w-xl">
          <h1 className="text-xl font-bold text-primary-test hidden md:block">
            Dashboard
          </h1>
        </div>
        {/* Right Side */}
        <RightNavbar />
      </div>
    </div>
  );
};

export default Navbar;
