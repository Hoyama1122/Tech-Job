/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { event } from "@/lib/calendar/Calendar";

const Calendar = () => {
  const [filterItem, setFilterItem] = useState("ทั้งหมด");

  // 🎯 ฟังก์ชันเมื่อคลิกวันที่
  const handleDateClick = (arg: any) => {
    alert(`คุณคลิกวันที่: ${arg.dateStr}`);
  };

  // 🎯 ฟังก์ชันกรอง event
  const filteredEvents =
    filterItem === "ทั้งหมด"
      ? event
      : event.filter((item: any) => item.type === filterItem);

  return (
    <div>
      <h1 className="font-title">
        ปฏิทิน <span className="ml-2">{new Date().toLocaleDateString()}</span>
      </h1>

      <div className="p-4 bg-white rounded-lg shadow mt-5">
        {/* 🔍 Dropdown Filter */}
        <div className="flex gap-3 mb-4">
          <label htmlFor="filter" className="font-semibold text-gray-700">
            กรองตามประเภทงาน:
          </label>
          <select
            id="filter"
            onChange={(e) => setFilterItem(e.target.value)}
            value={filterItem}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
          >
            <option value="ทั้งหมด">ทั้งหมด</option>
            <option value="ไฟฟ้า">ไฟฟ้า</option>
            <option value="ประปา">ประปา</option>
            <option value="แอร์">แอร์</option>
          </select>
        </div>

        {/* 📅 FullCalendar */}
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="th"
          selectable
          timeZone="Asia/Bangkok"
          dateClick={handleDateClick}
          events={filteredEvents}
          height="auto"
          eventDisplay="block"
          eventColor="#2563eb" // ปรับสี event ได้
        />
      </div>
    </div>
  );
};

export default Calendar;
