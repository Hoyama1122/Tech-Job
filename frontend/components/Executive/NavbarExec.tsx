"use client";
import React from "react";
import RightNavbarExec from "./RightNavbarExec";

const NavbarExec = () => {
  return (
    <div className="bg-[#F5F5F5] shadow-lg px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between gap-4">
        <div className="w-1/4 hidden md:block">
          <div></div>
        </div>
        <RightNavbarExec />
      </div>
    </div>
  );
};

export default NavbarExec;