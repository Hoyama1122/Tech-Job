"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Wrench, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import ModalSerach from "./ModalSerach";

export type NavItem = {
  name: string;
  path: string;
  icon: LucideIcon;
};

type SidebarProps = {
  navLinks: NavItem[];
  basePath: string;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
};

const Sidebar = ({ navLinks, basePath, isOpen, setIsOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [borderStyle, setBorderStyle] = useState({ top: 0, height: 0 });
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // คำนวณตำแหน่งของแถบ active
  useEffect(() => {
    const activeIndex = navLinks.findIndex((link) => {
      const fullPath = link.path === "/" ? basePath : `${basePath}${link.path}`;
      return pathname.replace(/\/+$/, "") === fullPath.replace(/\/+$/, "");
    });

    if (activeIndex >= 0 && itemsRef.current[activeIndex]) {
      const activeElement = itemsRef.current[activeIndex];
      setBorderStyle({
        top: activeElement.offsetTop,
        height: activeElement.offsetHeight,
      });
    }
  }, [pathname, navLinks, basePath]);

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden p-3 text-white bg-primary fixed top-4 left-4 z-50 rounded-lg hover:scale-105 transition-transform"
        >
          <Menu size={24} />
        </button>
      )}

      {/* 🔘 Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-30 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`bg-primary text-white w-64 fixed md:static 
          md:h-screen min-h-screen h-full flex flex-col overflow-y-auto transform transition-transform duration-300 z-[999]
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Header */}
        <div className="py-6 px-4 flex items-center justify-between bg-black/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Wrench size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Tech Job</h1>
              <p className="text-sm font-primary">ระบบจัดการงานช่าง</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-3 rounded-lg hover:scale-105 transition-transform flex-shrink-0"
          >
            <X size={24} />
          </button>
        </div>

        <div className="h-1 bg-gradient-to-r from-transparent via-white/80 to-transparent flex-shrink-0" />

        {/* Search button */}
        <div className="px-4 mt-4">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="bg-accent shadow-2xl cursor-pointer rounded gap-2 px-4 py-2 flex items-center w-full text-left text-lg hover:bg-accent/80 transition"
          >
            <Search size={20} className="text-white" />
            <span className="text-white font-semibold">ค้นหา...</span>
          </button>
        </div>

        {/* Active Border */}
        <nav className="py-4 flex-1 relative min-h-0 overflow-y-auto">
          <div
            className="absolute left-0 w-1 bg-white  rounded-r-full transition-all duration-[0.15s] ease-out"
            style={{
              top: `${borderStyle.top}px`,
              height: `${borderStyle.height}px`,
            }}
          />

          <ul className="space-y-2 mt-4">
            {navLinks.map((link, index) => {
              const Icon = link.icon;
              const fullPath =
                link.path === "/" ? basePath : `${basePath}${link.path}`;
              const isActive =
                pathname.replace(/\/+$/, "") === fullPath.replace(/\/+$/, "");
              return (
                <li
                  key={index}
                  ref={(el) => {
                    itemsRef.current[index] = el;
                  }}
                >
                  <Link
                    href={basePath + link.path}
                    className={`flex items-center gap-3 px-4 py-3 text-lg transition-all duration-300 ${
                      isActive ? "bg-white/10 font-semibold" : "hover:bg-white/20 text-white/70"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={20} className={`${isActive ? "text-white" : "text-white/70"}`}/>
                    <span>{link.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Modal */}
      {isSearchOpen && (
        <ModalSerach
       
          setIsSearchOpen={setIsSearchOpen}
        />
      )}
    </>
  );
};

export default Sidebar;
