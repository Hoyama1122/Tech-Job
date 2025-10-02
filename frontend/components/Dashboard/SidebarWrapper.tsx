"use client";

import Sidebar from "./Sidebar";
import React, { useState } from "react";

const SidebarWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);

  return <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />;
};

export default SidebarWrapper;
