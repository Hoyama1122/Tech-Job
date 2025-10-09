"use client";


import React, { useState } from "react";
import Sidebar from "./Sidebar";

const SidebarWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);

  return <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />;
};

export default SidebarWrapper;
