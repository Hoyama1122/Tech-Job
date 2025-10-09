"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Layout/Sidebar";
import { navLinkSupervisor } from "@/lib/Mock/NavSidebar";

const SidebarWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sidebar
      navLinks={navLinkSupervisor}
      basePath="/supervisor"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  );
};

export default SidebarWrapper;
