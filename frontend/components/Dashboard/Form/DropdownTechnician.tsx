"use client";

import React, { useState, useEffect, useRef } from "react";
import { Wrench, ChevronDown, Check, X, Users, AlertCircle, Loader2 } from "lucide-react";
import { useFormContext } from "react-hook-form";

export default function DropdownTechnician() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTechs, setSelectedTechs] = useState<any[]>([]);
  const [techList, setTechList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const ref = useRef<HTMLDivElement>(null);
  const { register, setValue, formState: { errors } } = useFormContext();

  // โหลดข้อมูลช่างจาก localStorage
  useEffect(() => {
    const loadTechnicians = () => {
      try {
        setIsLoading(true);
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

  // ปิด dropdown เมื่อกดนอกกรอบ
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleTech = (tech: any) => {
    const updated = selectedTechs.some((t) => t.id === tech.id)
      ? selectedTechs.filter((t) => t.id !== tech.id)
      : [...selectedTechs, tech];

    setSelectedTechs(updated);

    // อัพเดตค่าใน react-hook-form
    setValue("technicianId", updated.map((t) => t.id), {
      shouldValidate: true,
      shouldDirty: true,
    });

    // Auto-assign supervisor จากช่างคนแรก
    if (updated.length > 0) {
      const users = JSON.parse(localStorage.getItem("Users") || "[]");
      const supervisor = users.find(
        (u) => u.role === "supervisor" && u.department === updated[0].department
      );
      setValue("supervisorId", supervisor ? supervisor.id.toString() : "");
    } else {
      setValue("supervisorId", "");
    }
  };

  const errorMessage = errors.technicianId?.message as string;

  return (
    <div ref={ref} className="relative w-full">
      {/* Label */}
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
        <Users className="w-4 h-4 text-primary" />
        ช่างผู้รับผิดชอบ <span className="text-red-500">*</span>
      </label>

      {/* Hidden inputs */}
      <input type="hidden" {...register("technicianId", { required: "กรุณาเลือกช่างเทคนิคอย่างน้อย 1 คน" })} />
      <input type="hidden" {...register("supervisorId")} />

      {/* Selected Technicians Chips */}
      {selectedTechs.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedTechs.map((tech) => (
            <div
              key={tech.id}
              className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 text-primary px-3 py-1.5 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                {tech.name.charAt(0)}
              </div>
              <span className="flex-1">{tech.name}</span>
              <button
                type="button"
                onClick={() => toggleTech(tech)}
                className="p-0.5 rounded-full hover:bg-red-100 transition-colors flex-shrink-0"
              >
                <X size={14} className="text-red-500 group-hover:text-red-700" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 rounded-lg border bg-white flex items-center justify-between transition-all duration-200 ${
          isOpen
            ? "border-primary ring-2 ring-primary/20"
            : "border-gray-300 hover:border-gray-400"
        } ${errors.technicianId ? "border-red-500 ring-2 ring-red-500/20" : ""}`}
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-gray-100 rounded-md">
            <Wrench className={`w-4 h-4 ${isOpen ? "text-primary" : "text-gray-600"}`} />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {selectedTechs.length > 0
              ? `เลือกแล้ว ${selectedTechs.length} คน`
              : "เลือกช่างเทคนิค (เลือกได้หลายคน)"}
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {/* Error Message */}
      {errors.technicianId && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">
          <AlertCircle className="w-4 h-4" />
          {errorMessage}
        </div>
      )}

      {/* Dropdown Menu */}
      <div
        className={`absolute w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-50 transition-all duration-200 ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        {/* Loading State */}
        {isLoading && (
          <div className="px-4 py-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              <span className="text-sm text-gray-500">กำลังโหลดข้อมูล...</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && techList.length === 0 && (
          <div className="px-4 py-6 text-center">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">ไม่พบข้อมูลช่างเทคนิค</p>
            <p className="text-xs text-gray-400 mt-1">กรุณาเพิ่มช่างเทคนิคก่อน</p>
          </div>
        )}

        {/* Technician List */}
        {!isLoading && techList.length > 0 && (
          <div className="max-h-64 overflow-y-auto">
            {techList.map((tech) => {
              const isSelected = selectedTechs.some((t) => t.id === tech.id);
              return (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => toggleTech(tech)}
                  disabled={isSelected}
                  className={`w-full px-4 py-3 flex items-center justify-between transition-all duration-150 ${
                    isSelected
                      ? "bg-primary/5 cursor-not-allowed opacity-60"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${
                        isSelected ? "bg-primary" : "bg-gray-300"
                      }`}
                    >
                      {tech.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-800">{tech.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-500">{tech.department || "ไม่ระบุแผนก"}</span>
                        {tech.team && (
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                            {tech.team}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}