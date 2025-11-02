"use client";

import React, { useState, useRef, useEffect } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { th } from "date-fns/locale";
import { CalendarDays } from "lucide-react";

export default function DateRangePickerTH() {
  const [range, setRange] = useState<DateRange | undefined>();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatTH = (date?: Date) =>
    date.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const displayValue =
    range?.from && range?.to
      ? `${formatTH(range.from)} ถึงวันที่ ${formatTH(range.to)}`
      : "เลือกช่วงวันที่ทำงาน"  ;

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <label className="block text-lg font-medium text-gray-700 mb-1">
        ช่วงวันที่ <span className="text-red-500">*</span>
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-50 flex justify-between items-center focus:ring-2 focus:ring-primary/40 hover:shadow transition-all shadow-md hover:shadow"
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

      {/* Dropdown Calendar */}
      {open && (
        <div className="absolute top-[-30px] z-20 mt-2 bg-white p-4 border border-gray-200 rounded-xl shadow-lg">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={setRange}
            locale={th}
            classNames={{
              day_selected:
                "bg-primary text-white hover:bg-primary rounded-lg",
              day_range_start:
                "bg-primary text-white rounded-l-full hover:bg-primary/90",
              day_range_end:
                "bg-primary text-white rounded-r-full hover:bg-primary/90",
              day_today: "",
              day: "w-5 h-5",
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
