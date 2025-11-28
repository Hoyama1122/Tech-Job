"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Wrench,
  ChevronDown,
  Check,
  X,
  Users,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useFormContext } from "react-hook-form";

export default function DropdownTechnician({
  technicians,
}: {
  technicians: any[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTechs, setSelectedTechs] = useState<any[]>([]);
  const [techList, setTechList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState(""); // search text

  const ref = useRef<HTMLDivElement>(null);
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  // รับ technicians จาก props
  useEffect(() => {
    setTechList(technicians);
    setIsLoading(false);
  }, [technicians]);

  // ปิด dropdown เมื่อคลิกรอบนอก
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

    // update react-hook-form
    setValue(
      "technicianId",
      updated.map((t) => t.id),
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    );

    // auto assign supervisor
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

  // ฟิลเตอร์ตาม Search
  const filteredTech = techList.filter((tech) => {
    const keyword = search.toLowerCase();
    return (
      tech.name.toLowerCase().includes(keyword) ||
      tech.department?.toLowerCase().includes(keyword) ||
      tech.team?.toLowerCase().includes(keyword)
    );
  });

  const errorMessage = errors.technicianId?.message as string;

  return (
    <div ref={ref} className="relative w-full">
      {/* Label */}
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
        <Users className="w-4 h-4 text-primary" />
        ช่างผู้รับผิดชอบ <span className="text-red-500">*</span>
      </label>

      <input
        type="hidden"
        {...register("technicianId", {
          required: "กรุณาเลือกช่างเทคนิคอย่างน้อย 1 คน",
        })}
      />
      <input type="hidden" {...register("supervisorId")} />

      {/* Selected chips */}
      {selectedTechs.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedTechs.map((tech) => (
            <div
              key={tech.id}
              className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium"
            >
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                {tech.name.charAt(0)}
              </div>
              <span>{tech.name}</span>
              <button type="button" onClick={() => toggleTech(tech)}>
                <X size={14} className="text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropdown button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 rounded-lg border bg-white flex items-center justify-between ${
          isOpen ? "border-primary ring-2 ring-primary/20" : "border-gray-300"
        }`}
      >
        <span className="text-sm">
          {selectedTechs.length > 0
            ? `เลือกแล้ว ${selectedTechs.length} คน`
            : "เลือกช่างเทคนิค (เลือกได้หลายคน)"}
        </span>
        <ChevronDown
          className={`w-5 h-5 transition ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {errors.technicianId && (
        <div className="mt-2 text-sm text-red-500 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {errorMessage}
        </div>
      )}

      {/* Dropdown Menu */}
      <div
        className={`absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 transition-all ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Search Bar */}
        <div className="p-3 border-b border-gray-200 bg-gray-50">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาช่างเทคนิค..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-gray-200 focus:ring focus:border-gray-200"
          />
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="px-4 py-6 text-center">
            <Loader2 className="w-4 h-4 animate-spin text-gray-400 mx-auto" />
            <p className="text-sm text-gray-500 mt-2">กำลังโหลดข้อมูล...</p>
          </div>
        )}

        {/* Not found */}
        {!isLoading && filteredTech.length === 0 && (
          <div className="px-4 py-6 text-center text-gray-500">
            ไม่พบช่างตามที่ค้นหา
          </div>
        )}

        {/* List */}
        {!isLoading && filteredTech.length > 0 && (
          <div className="max-h-64 overflow-y-auto">
            {filteredTech.map((tech) => {
              const isSelected = selectedTechs.some((t) => t.id === tech.id);
              return (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => toggleTech(tech)}
                  disabled={isSelected}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
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
                      <p className="text-sm font-medium text-gray-800">
                        {tech.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-500">
                          {tech.department || "ไม่ระบุแผนก"}
                        </span>
                        {tech.team && (
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                            {tech.team}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-primary" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
