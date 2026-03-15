"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Layout/Sidebar";
import { navLinkSuperadmin } from "@/lib/Mock/NavSidebar";

const SidebarWrapperSuperAdmin = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sidebar
      navLinks={navLinkSuperadmin}
      basePath="/superadmin"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  );
};

export default SidebarWrapperSuperAdmin;
