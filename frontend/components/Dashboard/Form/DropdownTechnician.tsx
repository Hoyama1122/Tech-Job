"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Wrench,
  ChevronDown,
  X,
  Users,
  Check,
  AlertCircle,
} from "lucide-react";
import { useFormContext } from "react-hook-form";

export default function DropdownTechnician() {
  const [isOpen, setIsOpen] = useState(false);
  const [techList, setTechList] = useState<any[]>([]);
  const [selected, setSelected] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const ref = useRef<HTMLDivElement>(null);
  const {
    setValue,
    register,
    formState: { errors },
  } = useFormContext();

  // โหลดข้อมูลช่างจาก localStorage
  useEffect(() => {
    const loadTechnicians = () => {
      try {
        const users = JSON.parse(localStorage.getItem("Users") || "[]");
        const technicians = users.filter((u) => u.role === "technician");
        setTechList(technicians);
      } catch (error) {
        console.error("Failed to load technicians:", error);
        setTechList([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTechnicians();
  }, []);

  // ปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // เลือกช่าง
  const handleSelect = (item: any) => {
    if (selected.some((s) => s.id === item.id)) return; // กันเลือกซ้ำ

    const newSelected = [...selected, item];
    setSelected(newSelected);
    setValue(
      "technicianId",
      newSelected.map((t) => t.id),
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    );
  };

  // ลบช่าง
  const removeTech = (id: number) => {
    const newList = selected.filter((t) => t.id !== id);
    setSelected(newList);
    setValue(
      "technicianId",
      newList.map((t) => t.id),
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    );
  };

  const toggleDropdown = () => setIsOpen(!isOpen);
  const errorMessage = errors.technicianId?.message as string;

  return (
    <div ref={ref} className="relative w-full">
      {/* Label */}
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
        <Users className="w-4 h-4 text-primary" />
        ช่างผู้รับผิดชอบ <span className="text-red-500">*</span>
      </label>

      {/* Hidden input */}
      <input type="hidden" {...register("technicianId", { required: true })} />

      {/* Dropdown Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        className={`w-full px-4 py-3 rounded-lg border bg-white flex items-center justify-between transition-all duration-200 ${
          isOpen
            ? "border-primary ring-2 ring-primary/20"
            : "border-gray-300 hover:border-gray-400"
        } ${
          errors.technicianId ? "border-red-500 ring-2 ring-red-500/20" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-gray-100 rounded-md">
            <Wrench className="w-4 h-4 text-gray-600" />
          </div>
          <span className="text-sm text-gray-700">
            {selected.length > 0
              ? `เลือกแล้ว ${selected.length} คน`
              : "เลือกช่างเทคนิค (เลือกได้หลายคน)"}
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>
      {/* Selected Chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selected.map((technician) => (
            <div
              key={technician.id}
              className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium shadow-sm hover:bg-primary/20 transition-all duration-200 group"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>{technician.name}</span>
              <button
                type="button"
                onClick={() => removeTech(technician.id)}
                className="p-0.5 rounded-full hover:bg-red-100 transition-colors"
              >
                <X
                  size={14}
                  className="text-red-500 group-hover:text-red-700"
                />
              </button>
            </div>
          ))}
        </div>
      )}
      {/* Error Message */}
      {errors.technicianId && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">
          <AlertCircle className="w-4 h-4" />
          {errorMessage || "กรุณาเลือกช่างเทคนิคอย่างน้อย 1 คน"}
        </div>
      )}

      {/* Dropdown Menu */}
      <div
        className={`absolute w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50 transition-all duration-200 ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        {/* Loading State */}
        {isLoading && (
          <div className="px-4 py-3 text-center text-sm text-gray-500">
            <div className="flex items-center justify-center gap-2">
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
            <p className="mt-2">กำลังโหลดข้อมูล...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && techList.length === 0 && (
          <div className="px-4 py-6 text-center">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">ไม่พบข้อมูลช่างเทคนิค</p>
            <p className="text-xs text-gray-400 mt-1">
              กรุณาเพิ่มช่างเทคนิคก่อน
            </p>
          </div>
        )}

        {/* Technician List */}
        {!isLoading && techList.length > 0 && (
          <div className="max-h-64 overflow-y-auto">
            {techList.map((technician) => {
              const isSelected = selected.some((s) => s.id === technician.id);
              return (
                <button
                  key={technician.id}
                  type="button"
                  onClick={() => handleSelect(technician)}
                  disabled={isSelected}
                  className={`w-full px-4 py-3 flex items-center justify-between transition-all duration-150 ${
                    isSelected
                      ? "bg-primary/5 cursor-not-allowed opacity-60"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0
                        ${
                          isSelected
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                    >
                      {technician.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-800">
                        {technician.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        รหัส: {technician.id}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
