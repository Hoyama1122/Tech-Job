/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Layers,
  ChevronDown,
  Wifi,
  Droplets,
  Snowflake,
  Zap,
} from "lucide-react";
import { useFormContext } from "react-hook-form";

const categories = [
  { id: "ไฟฟ้า", label: "งานไฟฟ้า", icon: <Zap size={16} /> },
  { id: "แอร์", label: "งานแอร์", icon: <Snowflake size={16} /> },
  { id: "ประปา", label: "งานประปา", icon: <Droplets size={16} /> },
  { id: "ระบบสื่อสาร", label: "งานระบบสื่อสาร", icon: <Wifi size={16} /> },
  { id: "ทั่วไป", label: "งานทั่วไป", icon: <Layers size={16} /> },
];

export default function DropdownCategory() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { setValue, register } = useFormContext();

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const handleSelect = (item: any) => {
    setSelected(item);
    setValue("category", item.id);
    setIsOpen(false);
  };

  return (
    <div ref={ref} className="relative mt-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        ประเภทงาน <span className="text-red-500">*</span>
      </label>

      {/* hidden input */}
      <input type="hidden" {...register("category")} />

      {/* main button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className={`w-full flex items-center justify-between px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-sm shadow-sm hover:bg-gray-50 transition ${
          isOpen ? "ring-1 ring-primary border-primary" : ""
        }`}
      >
        {selected ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-primary">
              <Layers size={16} />
            </div>
            <span className="text-gray-800 text-sm">{selected.label}</span>
          </div>
        ) : (
          <span className="flex items-center gap-2 text-gray-500 text-sm">
            <Layers size={16} /> เลือกประเภทงาน
          </span>
        )}

        <ChevronDown
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180 text-primary" : "text-gray-400"
          }`}
          size={16}
        />
      </button>

      {/* dropdown list */}
      {isOpen && (
        <div className="absolute z-20 w-full bg-white border border-gray-100 shadow-md rounded-lg mt-1 overflow-hidden">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat)}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-primary/5 transition text-left"
            >
              <div className="w-6 h-6 bg-gray-200 cursor-pointer rounded flex items-center justify-center text-gray-600 text-xs">
                {cat.icon}
              </div>
              <span className="text-gray-800">{cat.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
