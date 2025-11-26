"use client";

import formatThaiDateTime from "@/lib/Format/DateFormatThai";
import DateFormatWork from "@/lib/Format/DateForWork";
import {
  Calendar,
  CalendarCheck,
  ChevronRight,
  FileText,
  MapPin,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";

type CardWork = {
  id: number;
  JobId: string;
  title: string;
  description: string;
  createdAt: string;
  dateRange?: {
    startAt: string;
    endAt: string;
  };
  technicianId: number[];
  customer: { name: string; phone: string; address: string };
  status: string;
};

export default function CalendarTechJob() {
  const router = useRouter();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [jobs, setJobs] = useState<CardWork[]>([]);
  const [techId, setTechId] = useState<number | null>(null);
  useEffect(() => {
  
    const today = new Date();
    setSelectedDate(today);

    // โหลดข้อมูล technician
    const auth = JSON.parse(localStorage.getItem("auth-storage") || "{}");
    const userId = auth?.state?.userId;
    setTechId(userId);

    // โหลดงาน
    const cw = JSON.parse(localStorage.getItem("CardWork") || "[]");
    setJobs(cw);
  }, []);

  // Get day and change month
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
    setSelectedDate(null);
  };

  // Get job date
  const getJobDate = (job: CardWork) => {
    if (job.dateRange?.startAt) return job.dateRange.startAt.slice(0, 10);
    return job.createdAt.slice(0, 10);
  };

  // Check if day is in range
  const isInRange = (day: number, job: CardWork) => {
    if (!job.dateRange) return false;

    const current = new Date(year, month, day).getTime();
    const start = new Date(job.dateRange.startAt).getTime();
    const end = new Date(job.dateRange.endAt).getTime();

    return current >= start && current <= end;
  };
  // Check if day is event
  const isEventDay = (day: number | null) => {
    if (!day || !techId) return false;

    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    return jobs.some((j) => {
      if (!j.technicianId.includes(techId)) return false;

      // งาน 1 วัน
      if (getJobDate(j) === dateStr) return true;

      // งานหลายวัน
      if (j.dateRange && isInRange(day, j)) return true;

      return false;
    });
  };

 
  const jobsOfSelectedDay = useMemo(() => {
    if (!selectedDate || !techId) return [];

    const d = `${selectedDate.getFullYear()}-${String(
      selectedDate.getMonth() + 1
    ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

    return jobs.filter((j) => {
      if (!j.technicianId.includes(techId)) return false;

      // งาน 1 วัน
      const jobDate = getJobDate(j);
      if (jobDate === d) return true;

      // งานหลายวัน
      if (j.dateRange && isInRange(selectedDate.getDate(), j)) return true;

      return false;
    });
  }, [selectedDate, jobs, techId]);


  const getStatusBadge = (status: string) => {
    const styles = {
      กำลังทำงาน: "bg-yellow-100 text-yellow-700 border-yellow-200",
      สำเร็จ: "bg-green-100 text-green-700 border-green-200",
      รอการดำเนินงาน: "bg-orange-100 text-orange-700 border-orange-200",
      รอการตรวจสอบ: "bg-blue-100 text-blue-700 border-blue-200",
    };

    const defaultStyle = "bg-gray-100 text-gray-700 border-gray-200";

    return (
      <span
        className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
          styles[status] || defaultStyle
        }`}
      >
        {status}
      </span>
    );
  };


  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary" />
          ปฏิทินงาน
        </h1>
        <p className="text-sm text-gray-600 px-2">ปฏิทินงานของคุณ</p>
      </div>

      {/* Calendar */}
      <div className="max-w-md mx-auto p-4 bg-white rounded-xl shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {currentDate.toLocaleString("th-TH", {
              month: "long",
              year: "numeric",
            })}
          </h2>

          <div className="flex gap-2">
            <button onClick={() => changeMonth(-1)} className="px-2 py-1">
              ▲
            </button>
            <button onClick={() => changeMonth(1)} className="px-2 py-1">
              ▼
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 text-center gap-2">
          {days.map((day, i) => (
            <div
              key={i}
              onClick={() => day && setSelectedDate(new Date(year, month, day))}
              className={`relative p-2 rounded-lg cursor-pointer 
                ${day ? "hover:bg-gray-100" : "invisible"}
                ${
                  selectedDate &&
                  day &&
                  selectedDate.getDate() === day &&
                  selectedDate.getMonth() === month
                    ? "bg-blue-200"
                    : ""
                }
              `}
            >
              {day}

              {/* Event Dot */}
              {isEventDay(day) && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Text */}
      <div className="flex items-center gap-2 mt-2 px-4">
        <h1 className="text-2xl text-primary font-semibold flex items-center gap-2">
          <CalendarCheck className="w-6 h-6" />
          งานวันนี้
        </h1>
        <p className="text-sm text-gray-600 ">
          {jobsOfSelectedDay.length} งาน
        </p>
      </div>
      {/* Job List */}
      <div className="mt-4">
        {jobsOfSelectedDay.length > 0
          ? jobsOfSelectedDay.map((job: any) => (
              <div
                key={job.JobId}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer mb-3"
                onClick={() => router.push(`/technician/${job.JobId}`)}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="bg-primary/20 rounded-lg p-2">
                        <FileText className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          ลูกค้า: {job.customer?.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {job.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-primary" />
                        {job.customer?.address}
                      </span>
                    </div>

                    <div className="mt-1 text-sm text-gray-600">
                      {DateFormatWork(job.dateRange.startAt)} -{" "}
                      {DateFormatWork(job.dateRange.endAt)}
                    </div>

                    <div className="mt-2 text-xs text-gray-500">
                      หมายเลขงาน: #{job.JobId}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 mt-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {job.technicianId?.length} ช่าง
                      </span>
                    </div>

                    <div className="flex items-center">
                      {getStatusBadge(job.status)}
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          : selectedDate && (
              <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">ไม่มีงานในวันนี้</p>
              </div>
            )}
      </div>
    </div>
  );
}
