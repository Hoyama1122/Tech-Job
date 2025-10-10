"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Wrench } from "lucide-react";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

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

  useEffect(() => {
    const activeIndex = navLinks.findIndex((link) => {
      const fullPath =
        link.path === "/" ? basePath : `${basePath}${link.path}`;
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
      {/* 🔘 Burger Button (Mobile) */}
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
          className="md:hidden fixed inset-0 bg-black/30 z-30 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 🧱 Sidebar */}
      <div
        className={`bg-primary text-white w-64 fixed md:static inset-0 md:h-screen 
        flex flex-col overflow-y-auto transform transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Header */}
        <div className="py-6 px-4 flex items-center justify-between bg-black/10">
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
            className="md:hidden p-3 rounded-lg hover:scale-105 transition-transform"
          >
            <X size={24} />
          </button>
        </div>

        <div className="h-1 bg-gradient-to-r from-transparent via-white/80 to-transparent" />

        {/* Nav Links */}
        <nav className="py-8 flex-1 relative">
          {/* Animated Border */}
          <div
            className="absolute left-0 w-1 bg-white transition-all duration-[0.15s] ease-out"
            style={{
              top: `${borderStyle.top}px`,
              height: `${borderStyle.height}px`,
            }}
          />

          <ul className="space-y-2">
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
                    className={`flex items-center gap-3 px-4 py-2 text-lg transition-all duration-300 ${
                      isActive ? "bg-white/10" : "hover:bg-white/20"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={20} />
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;