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

  const formDate = watch("date");

  // state เก็บช่วงวันที่
  const [range, setRange] = useState<DateRange | undefined>(
    formDate
      ? {
          from: formDate.start ? new Date(formDate.start) : undefined,
          to: formDate.end ? new Date(formDate.end) : undefined,
        }
      : undefined
  );

  // ปิด popup เมื่อคลิกนอก
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // เมื่อเลือกช่วงวัน
  const handleSelect = (selectedRange?: DateRange) => {
    setRange(selectedRange);

    if (selectedRange?.from && selectedRange?.to) {
      const start = selectedRange.from.toLocaleDateString("th-TH", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const end = selectedRange.to.toLocaleDateString("th-TH", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      setValue("date", {
        start,
        end,
      });
    }
  };

  // ข้อความโชว์ด้านบน
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
      <input type="hidden" {...register("date")} />

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
            classNames={{
              day_selected: "bg-primary text-white hover:bg-primary rounded-lg",
              day_range_start: "bg-primary text-white rounded-l-lg",
              day_range_end: "bg-primary text-white rounded-r-lg",
              day_range_middle: "bg-primary/20",
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
