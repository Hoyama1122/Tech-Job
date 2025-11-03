"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Layout/Sidebar";
import { navLinkAdmin } from "@/lib/Mock/NavSidebar";

const SidebarWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sidebar
      navLinks={navLinkAdmin}
      basePath="/admin"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  );
};

export default SidebarWrapper;
