/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  X,
  Wrench,
  Search,
  ArrowBigRight,
  LogOut,
  CirclePower,
  Menu,
} from "lucide-react";
import { toast } from "react-toastify";
import ModalSerach from "../Modal/ModalSerach";
import LogoutModal from "../Modal/LogoutModal";

const Sidebar = ({ navLinks, basePath, isOpen, setIsOpen }: any) => {
  const pathname = usePathname();
  const router = useRouter();
  const [borderStyle, setBorderStyle] = useState({ top: 0, height: 0 });
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    try {
      localStorage.removeItem("auth-storage");
      toast.success("ออกจากระบบสำเร็จ", {
        autoClose: 1500,
      });

      setTimeout(() => {
        router.push("/");
      }, 500);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("เกิดข้อผิดพลาดในการออกจากระบบ", {
        position: "top-center",
      });
    }
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden p-3 text-white cursor-pointer bg-primary fixed top-4 left-0 z-50 rounded-r-lg hover:scale-105 transition-transform shadow-lg"
      >
        <Menu size={24} className="text-white" />
      </button>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-primary text-white w-64 fixed top-0 left-0 h-screen
        flex flex-col overflow-hidden transform transition-transform duration-300 z-[999]
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
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
            className="lg:hidden p-3 rounded-lg hover:bg-white/20 transition-colors flex-shrink-0"
          >
            <X size={24} />
          </button>
        </div>

        <div className="h-1 bg-gradient-to-r from-transparent via-white/80 to-transparent flex-shrink-0" />

       

        <nav className="py-4 flex-1 overflow-y-auto relative">
          <div
            className="absolute left-0 w-1 bg-white rounded-r-full transition-all duration-200 ease-out"
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
                    className={`flex items-center gap-3 px-4 py-3 text-lg transition-all duration-300 rounded-lg mx-2 ${
                      isActive
                        ? "bg-white/10 font-semibold text-white"
                        : "text-white/70 hover:bg-white/20 hover:text-white"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon
                      size={20}
                      className={`${isActive ? "text-white" : "text-white/70"}`}
                    />
                    <span>{link.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-white/20 flex-shrink-0 bg-black/10">
          <button
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-3 px-4 py-4 text-lg text-white/80 hover:text-white hover:bg-red-500/30 transition-all duration-200 ease-in-out w-full active:scale-95  active:rounded-lg"
          >
            <CirclePower size={20} />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

  
      {isSearchOpen && <ModalSerach setIsSearchOpen={setIsSearchOpen} />}

   
      {showLogoutModal && (
        <LogoutModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={confirmLogout}
        />
      )}
    </>
  );
};

export default Sidebar;
