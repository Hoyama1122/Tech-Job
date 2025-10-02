"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, FileText, Users, X, HomeIcon, Wrench } from "lucide-react";
import { SidebarProps } from "@/lib/type/TypeSidebar";

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const navLink = [
    { name: "หน้าหลัก", path: "/", icon: <HomeIcon size={20} /> },
    { name: "ใบงาน", path: "/work", icon: <FileText size={20} /> },
    { name: "ผู้ใช้งาน", path: "/user", icon: <Users size={20} /> },
  ];

  return (
    <div className="flex">
      {/* Burger button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden p-3 text-white bg-gradient-to-br from-[#2E7D32] to-[#558B6E] fixed top-4 left-4 z-50 rounded-lg hover:scale-105"
        >
          <Menu size={24} />
        </button>
      )}
      {/* Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20  z-30 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
      {/* Sidebar */}
      <div
        className={`bg-gradient-to-b from-[#2E7D32] via-[#388E3C] to-[#1B5E20] text-white w-64 min-h-screen fixed md:static top-0 left-0 transform transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="py-6 px-4 flex items-center justify-between bg-black/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Wrench size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Tech Job</h1>
              <p className="text-sm">ระบบจัดการงานหางานช่าง</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-3  rounded-lg hover:scale-105"
          >
            <X size={24} />
          </button>
        </div>
        <div className="h-1 bg-gradient-to-r from-transparent via-white/80 to-transparent" />

        {/* Navigation */}
        <nav className="py-8 px-3">
          <ul className="space-y-4">
            {navLink.map((link, index) => (
              <li key={index}>
                <Link
                  href={"/dashboard" + link.path}
                  className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-[#388E3C] transition text-xl"
                  onClick={() => setIsOpen(false)}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
