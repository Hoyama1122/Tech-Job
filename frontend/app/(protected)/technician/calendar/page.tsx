"use client";

import {
  ArrowDown,
  ArrowUp,
  Calendar,
  CalendarCheck,
  ChevronRight,
  FileText,
  MapPin,
  Users,
} from "lucide-react";

import { jobService } from "@/services/job.service";
import { JobStatus, getStatusThai } from "@/types/job";
import DateFormatWork from "@/lib/Format/DateForWork";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";

// yyyy-mm-dd
const toDateString = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;

const getStatusBadge = (status: string) => {
  const s = status?.toUpperCase();
  const displayStatus = getStatusThai(status);
  
  const styles: Record<string, string> = {
    [JobStatus.PENDING]: "bg-blue-100 text-blue-700 border-blue-200",
    [JobStatus.IN_PROGRESS]: "bg-yellow-100 text-yellow-700 border-yellow-200",
    [JobStatus.SUBMITTED]: "bg-indigo-100 text-indigo-700 border-indigo-200",
    [JobStatus.COMPLETED]: "bg-green-100 text-green-700 border-green-200",
    [JobStatus.REJECTED]: "bg-red-100 text-red-700 border-red-200",
    "รอการดำเนินงาน": "bg-orange-100 text-orange-700 border-orange-200",
  };

  const style = styles[s] || styles[status] || "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${style}`}
    >
      {displayStatus}
    </span>
  );
};

import { useJobStore } from "@/store/useJobStore";

export default function CalendarTechJob() {
  const router = useRouter();
  const { myJobs: jobs, fetchMyJobs, isMyJobsLoading: isLoading } = useJobStore();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  useEffect(() => {
    fetchMyJobs();
  }, [fetchMyJobs]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);

  const totalDays = last.getDate();
  const offset = first.getDay();

  const calendarDays = [
    ...Array(offset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(year, month + offset, 1));
    setSelectedDate(null);
  };

  const isInRange = (day: number, targetYear: number, targetMonth: number, job: any) => {
    if (!job.start_available_at || !job.end_available_at) return false;

    const current = new Date(targetYear, targetMonth, day);
    current.setHours(0, 0, 0, 0);
    
    const start = new Date(job.start_available_at);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(job.end_available_at);
    end.setHours(23, 59, 59, 999);

    return current >= start && current <= end;
  };

  // event checker
  const isEventDay = (day: number | null) => {
    if (!day) return false;
    return jobs.some((job) => isInRange(day, year, month, job));
  };

  // selected day jobs
  const jobsOfSelectedDay = useMemo(() => {
    if (!selectedDate) return [];

    return jobs.filter((job) => 
      isInRange(selectedDate.getDate(), selectedDate.getFullYear(), selectedDate.getMonth(), job)
    );
  }, [selectedDate, jobs]);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary" />
          ปฏิทินงาน
        </h1>
        <p className="text-sm text-gray-600 px-1">ปฏิทินงานของคุณ</p>
      </div>

      {/* Calendar */}
      <div className="max-w-md mx-auto bg-white rounded-xl shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {currentDate.toLocaleString("th-TH", {
              month: "long",
              year: "numeric",
            })}
          </h2>

          <div className="flex gap-1">
            <button onClick={() => changeMonth(-1)} className="px-2 py-1">
              <ArrowUp className="w-5 h-5 text-primary" />
            </button>
            <button onClick={() => changeMonth(1)} className="px-2 py-1">
              <ArrowDown className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-2 text-center">
          {calendarDays.map((day, i) => (
            <div
              key={i}
              onClick={() => day && setSelectedDate(new Date(year, month, day))}
              className={`relative p-2 rounded-lg cursor-pointer ${
                day ? "hover:bg-gray-100" : "invisible"
              } ${
                selectedDate &&
                day &&
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === month
                  ? "bg-blue-200"
                  : ""
              }`}
            >
              {day}

              {isEventDay(day) && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary/80 rounded-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Day Title */}
      <div className="flex items-center gap-2 mt-4 px-1">
        <h1 className="text-2xl text-primary font-semibold flex items-center gap-2">
          <CalendarCheck className="w-6 h-6" />
          งานวันนี้
        </h1>
        <p className="text-sm text-gray-600">{jobsOfSelectedDay.length} งาน</p>
      </div>

      {/* Job List */}
      <div className="mt-3">
        {jobsOfSelectedDay.length ? (
          jobsOfSelectedDay.map((job) => (
            <div
              key={job.JobId}
              onClick={() => router.push(`/technician/${job.JobId}`)}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md border border-gray-200 hover:border-gray-300 transition cursor-pointer mb-3"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/20 p-2 rounded-lg">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        ลูกค้า: {job.customer?.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {job.description}
                      </p>
                    </div>
                  </div>

                  <p className="mt-2 text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-primary" />
                    {job.customer?.address}
                  </p>

                  <p className="mt-1 text-sm text-gray-700">
                    {DateFormatWork(job.start_available_at)} -{" "}
                    {DateFormatWork(job.end_available_at)}
                  </p>

                  <span className="text-xs text-gray-500 block mt-1">
                    หมายเลขงาน: #{job.JobId}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center text-xs text-gray-500">
                    <Users className="w-4 h-4 mr-1" />
                    {job.technicians?.length || 0} ช่าง
                  </div>

                  {getStatusBadge(job.status)}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">ไม่มีงานในวันนี้</p>
          </div>
        )}
      </div>
    </div>
  );
}
