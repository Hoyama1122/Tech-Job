"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Layout/Sidebar";
import { navLinkExecutive } from "@/lib/Mock/NavSidebar";

const SidebarWrapperExc = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sidebar
      navLinks={navLinkExecutive}
      basePath="/executive"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  );
};

export default SidebarWrapperExc;
