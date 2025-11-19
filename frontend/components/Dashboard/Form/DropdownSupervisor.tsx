/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { UserStar, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { Users } from "@/lib/Mock/UserMock";

export default function DropdownSupervisor() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const { setValue, register } = useFormContext();

  useEffect(() => {
    const filtered = Users.filter((user) => user.role === "supervisor");
    setSupervisors(filtered);
  }, []);

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
    setValue("supervisorId", String(item.id));
    setIsOpen(false);
  };

  return (
    <div ref={ref} className="relative w-full max-w-md mt-4">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
        <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
        หัวหน้างาน <span className="text-red-500">*</span>
      </label>

      {/* Hidden input for react-hook-form */}
      <input type="hidden" {...register("supervisorId")} />

      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className={`w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-xl shadow-md bg-gray-50 hover:shadow transition-all duration-200 ${
          isOpen ? "ring-2 ring-primary border-primary" : ""
        }`}
      >
        {selected ? (
          <div className="flex items-center gap-2">
            {selected.avatar ? (
              <Image
                src={selected.avatar}
                alt={selected.name}
                width={28}
                height={28}
                className="rounded-md object-cover border border-gray-200"
              />
            ) : (
              <div className="w-7 h-7 bg-gray-300 rounded-md flex items-center justify-center text-white text-sm">
                {selected.name[0]}
              </div>
            )}
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
        <div className="absolute z-20 w-full bg-white border border-gray-100 shadow-lg rounded-xl overflow-hidden animate-in fade-in-80 slide-in-from-top-1">
          {supervisors.map((sup) => (
            <button
              key={sup.id}
              onClick={() => handleSelect(sup)}
              className="w-full cursor-pointer flex items-center gap-3 px-4 py-2 hover:bg-primary/5 transition-colors text-left"
            >
              {sup.avatar ? (
                <Image
                  src={sup.avatar}
                  alt={sup.name}
                  width={28}
                  height={28}
                  className="rounded-md object-cover border border-gray-200"
                />
              ) : (
                <div className="w-7 h-7 bg-gray-300 rounded-md flex items-center justify-center text-white text-sm">
                  {sup.name[0]}
                </div>
              )}
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
