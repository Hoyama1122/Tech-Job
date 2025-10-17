"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Layout/Sidebar";
import { navLinkTechnician } from "@/lib/Mock/NavSidebar";


const SidebarWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sidebar
      navLinks={navLinkTechnician}
      basePath="/technician"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  );
};

export default SidebarWrapper;
