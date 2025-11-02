/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { UserStar, ChevronDown } from "lucide-react";
import Image from "next/image";
import { Supervisor } from "@/lib/Mock/Supervisor";

export default function DropdownSupervisor() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const ref = useRef<HTMLDivElement>(null);

  // ปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: any) => {
    setSelected(item);
    setIsOpen(false);
  };

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <label className="block text-lg font-medium text-tex t mb-1">
        หัวหน้างานที่รับผิดชอบ <span className="text-red-500">*</span>
      </label>

      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className={`w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-xl shadow-sm bg-gray-50 hover:shadow transition-all duration-200 ${
          isOpen ? "ring-2 ring-primary/40 border-primary" : ""
        }`}
      >
        {selected ? (
          <div className="flex items-center gap-2">
            <Image
              src={selected.image}
              alt={selected.name}
              width={28}
              height={28}
              className="rounded-md object-cover border border-gray-200"
            />
            <div className="flex flex-col text-left">
              <span className="font-medium text-gray-800">{selected.name}</span>
              <span className="text-xs text-gray-500">
                {selected.department}
              </span>
            </div>
          </div>
        ) : (
          <span className="flex items-center gap-2 text-gray-500">
            <UserStar size={18} /> เลือกหัวหน้างาน
          </span>
        )}
        <ChevronDown
          className={`ml-2 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-primary" : "text-gray-400"
          }`}
          size={18}
        />
      </button>

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute z-20 mt-2 w-full bg-white border border-gray-100 shadow-lg rounded-xl overflow-hidden animate-in fade-in-80 slide-in-from-top-1">
          {Supervisor.map((sup) => (
            <button
              key={sup.id}
              onClick={() => handleSelect(sup)}
              className="w-full cursor-pointer flex items-center gap-3 px-4 py-2 hover:bg-primary/5 transition-colors text-left"
            >
              <Image
                src={sup.image}
                alt={sup.name}
                width={28}
                height={28}
                className="rounded-md object-cover border border-gray-200"
              />
              <div className="flex flex-col">
                <span className="font-medium text-gray-800">{sup.name}</span>
                <span className="text-xs text-gray-500">{sup.department}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
