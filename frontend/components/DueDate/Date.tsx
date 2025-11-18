"use client";

import React, { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { th } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import { useFormContext } from "react-hook-form";

export default function DatePickerTH() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { setValue, register, watch } = useFormContext();

  // อ่านค่าจากฟอร์ม (ถ้ามีค่าเก่า)
  const formDate = watch("date");

  const [selected, setSelected] = useState<Date | undefined>(
    formDate ? new Date(formDate) : undefined
  );

  // ปิด popup เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // เมื่อเลือกวัน
  const handleSelect = (day?: Date) => {
  setSelected(day);
  if (day) {
    const formattedDate = day.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setValue("date", formattedDate);
    setOpen(false);
  }
};

  const formatTH = (date?: Date) =>
    date?.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const displayValue = selected ? formatTH(selected) : "เลือกวันที่ทำงาน";

  return (
    <div ref={ref} className="relative w-full max-w-md mt-4">
      <label className="block text-lg font-medium text-gray-700 mb-1">
        วันที่ทำงาน <span className="text-red-500">*</span>
      </label>

  
      <input type="hidden" {...register("date")} />

    
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 flex justify-between items-center 
        focus:ring-2 focus:ring-primary/40 transition-all shadow-md hover:shadow"
      >
        <span
          className={`text-sm md:text-base font-medium ${
            selected ? "text-gray-900" : "text-gray-500"
          }`}
        >
          {displayValue}
        </span>
        <CalendarDays className="text-gray-500" size={20} />
      </button>

      {open && (
        <div className="absolute top-[-30px] z-20 mt-2 bg-white p-2 border border-gray-200 rounded-xl shadow-lg">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            locale={th}
            classNames={{
              day_selected: "bg-primary text-white hover:bg-primary rounded-lg",
              day_today: "border border-primary text-primary font-semibold",
              day: "w-8 h-8",
            }}
          />
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-3 bg-primary cursor-pointer py-1.5 text-sm text-white rounded-lg transition"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
