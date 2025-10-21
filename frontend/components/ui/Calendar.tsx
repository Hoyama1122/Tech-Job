"use client";
import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Calendar = () => {
  const MonthTh = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) daysArray.push(null);
  for (let i = 1; i <= daysInMonth; i++) daysArray.push(i);
  while (daysArray.length < 42) daysArray.push(null); // fix height 6 แถว

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const daysTh = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

  return (
    <div className="max-w-md w-full p-4 bg-white rounded-xl shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4  gap-2">
        <h2 className="text-lg sm:text-2xl font-bold px-2 w-full ">
          {MonthTh[month]} {year}
        </h2>
        <div className="gap-2 flex justify-center ">
          <button
            onClick={handlePrevMonth}
            className="bg-primary text-white cursor-pointer p-1 md:p-2 rounded hover:bg-primary/80 active:scale-95 transition"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={handleNextMonth}
            className="bg-primary text-white cursor-pointer p-1 md:p-2  rounded hover:bg-primary/80 active:scale-95 transition"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 text-center font-semibold mb-2 text-xs sm:text-sm">
        {daysTh.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-7 text-center gap-[2px] sm:gap-1 md:gap-2">
        {daysArray.map((day, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center justify-center py-2 sm:py-3 rounded-lg cursor-pointer text-sm sm:text-base transition-all ${
              day
                ? "hover:bg-primary/10 cursor-pointer"
                : "text-transparent select-none"
            } ${
              day === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear()
                ? "bg-primary text-white font-bold"
                : ""
            }`}
          >
            {day}
            {/* จุดแสดง event */}
            <div className="flex items-center justify-center gap-[2px] mt-[2px] sm:mt-1">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
