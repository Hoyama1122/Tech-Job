/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { event } from "@/lib/calendar/Calendar";

const Calendar = () => {
  const handleDateClick = (arg: any) => {
    alert(`คุณคลิกวันที่: ${arg.dateStr}`);
  };

  return (
   <div>
    <h1 className="font-title">ปฏิทิน <span className="ml-2 ">{new Date().toLocaleDateString()}</span></h1>
     <div className="p-4 bg-white rounded-lg shadow mt-5">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        timeZone="Asia/Bangkok"
        dateClick={handleDateClick}
        events={event}
        height="auto"
      />
    </div>
   </div>
  );
};

export default Calendar;
