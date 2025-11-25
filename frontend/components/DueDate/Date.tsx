"use client";

import React, { useState, useRef, useEffect } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { th } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import { useFormContext } from "react-hook-form";

export default function DatePickerTH() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { setValue, register, watch } = useFormContext();

  // watch dateRange
  const formDate = watch("dateRange");

  // state เก็บช่วงวันที่
  const [range, setRange] = useState<DateRange | undefined>(
    formDate
      ? {
          from: formDate.startAt ? new Date(formDate.startAt) : undefined,
          to: formDate.endAt ? new Date(formDate.endAt) : undefined,
        }
      : undefined
  );

  // ปิด popup เมื่อคลิกนอก
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // เมื่อเลือกช่วงวัน
  const handleSelect = (selected?: DateRange) => {
    setRange(selected);

    if (selected?.from && selected?.to) {
      const start = selected.from.toLocaleDateString("th-TH", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const end = selected.to.toLocaleDateString("th-TH", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      // set values ให้ตรง schema
      setValue("dateRange.startAt", start, { shouldValidate: true });
      setValue("dateRange.endAt", end, { shouldValidate: true });
    }
  };

  const displayValue =
    range?.from && range?.to
      ? `${range.from.toLocaleDateString("th-TH", {
          day: "numeric",
        })} - ${range.to.toLocaleDateString("th-TH", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}`
      : "เลือกช่วงวันที่ทำงาน";

  return (
    <div ref={ref} className="relative w-full max-w-md mt-4">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
        <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
        ช่วงวันที่ <span className="text-red-500">*</span>
      </label>

      {/* hidden form field */}
      <input type="hidden" {...register("dateRange.startAt")} />
      <input type="hidden" {...register("dateRange.endAt")} />

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 flex justify-between items-center 
        focus:ring-2 focus:ring-primary/40 transition-all shadow-md hover:shadow"
      >
        <span
          className={`text-sm md:text-base font-medium ${
            range?.from && range?.to ? "text-gray-900" : "text-gray-500"
          }`}
        >
          {displayValue}
        </span>
        <CalendarDays className="text-gray-500" size={20} />
      </button>

      {open && (
        <div className="absolute top-[-30px] left-0 z-20 mt-2 bg-white p-3 border border-gray-200 rounded-xl shadow-lg">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleSelect}
            locale={th}
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
