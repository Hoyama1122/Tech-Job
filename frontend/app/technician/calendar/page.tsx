"use client";

import React, { useState } from "react";

type Event = {
  date: string; // YYYY-MM-DD
};

const events: Event[] = [
  { date: "2024-04-09" },
  { date: "2024-04-10" },
  { date: "2024-04-19" },
  { date: "2024-04-22" },
  { date: "2024-04-28" },
];

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 3)); // April 2024
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2024, 3, 22));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startDay = firstDayOfMonth.getDay();

  const days: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(year, month + offset, 1));
  };

  const isEventDay = (day: number | null) => {
    if (!day) return false;
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.some((e) => e.date === dateStr);
  };

  const isSelected = (day: number | null) => {
    if (!day || !selectedDate) return false;
    return (
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === day
    );
  };

  const handleSelect = (day: number | null) => {
    if (!day) return;
    setSelectedDate(new Date(year, month, day));
  };

  return (
    <div>
    <div className="max-w-md mx-auto p-4 bg-white rounded-xl shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          {currentDate.toLocaleString("en-US", { month: "long" })} {year}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => changeMonth(-1)}
            className="px-2 py-1 rounded-lg hover:bg-gray-100"
          >
            ▲
          </button>
          <button
            onClick={() => changeMonth(1)}
            className="px-2 py-1 rounded-lg hover:bg-gray-100"
          >
            ▼
          </button>
        </div>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 text-center text-gray-500 font-medium mb-2">
        {daysOfWeek.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-7 text-center gap-2">
        {days.map((day, idx) => (
          <div
            key={idx}
            onClick={() => handleSelect(day)}
            className={`relative py-2 rounded-lg cursor-pointer transition-all 
              ${day ? "hover:bg-gray-100" : ""}
              ${isSelected(day) ? "bg-blue-100 text-blue-700 font-semibold" : ""}
              ${!day ? "invisible" : ""}
            `}
          >
            {day && <span>{day}</span>}

            {/* Event dot */}
            {isEventDay(day) && (
              <span
                className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                  isSelected(day) ? "bg-blue-700" : "bg-blue-500"
                }`}
              ></span>
            )}
          </div>
        ))}
      </div>
      
    </div>
    <div>
      <div className="mt-4 bg-gray-300 rounded-lg p-3 flex justify-between">
        <div>
          <span className="text-xl">ลูกค้า : บริษัทกำลังสร้าง</span>
          <p>รายละเอียดงาน</p>
          <p>ทีม: 5หัวหน้าสมิง</p>
          <p>วันจันทร์ที่ 13 กุมภาพันธ์ 2568</p>
        </div>

        <div className="flex flex-col justify-between text-right">
          <p className="">เลขที่ใบงาน : 0001</p>
          <div className="">
            <div className="flex justify-end mr-1">
              <svg
                className="w-6 h-6 text-red-800 "
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <p>map</p>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-gray-300 rounded-lg p-3 flex justify-between">
        <div>
          <span className="text-xl">ลูกค้า : บริษัทกำลังสร้าง</span>
          <p>รายละเอียดงาน</p>
          <p>ทีม: 5หัวหน้าสมิง</p>
          <p>วันจันทร์ที่ 13 กุมภาพันธ์ 2568</p>
        </div>

        <div className="flex flex-col justify-between text-right">
          <p className="">เลขที่ใบงาน : 0001</p>
          <div className="">
            <div className="flex justify-end mr-1">
              <svg
                className="w-6 h-6 text-red-800 "
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <p>map</p>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-gray-300 rounded-lg p-3 flex justify-between">
        <div>
          <span className="text-xl">ลูกค้า : บริษัทกำลังสร้าง</span>
          <p>รายละเอียดงาน</p>
          <p>ทีม: 5หัวหน้าสมิง</p>
          <p>วันจันทร์ที่ 13 กุมภาพันธ์ 2568</p>
        </div>

        <div className="flex flex-col justify-between text-right">
          <p className="">เลขที่ใบงาน : 0001</p>
          <div className="">
            <div className="flex justify-end mr-1">
              <svg
                className="w-6 h-6 text-red-800 "
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <p>map</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
