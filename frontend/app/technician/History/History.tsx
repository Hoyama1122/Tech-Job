"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  MapPin,
  Users,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import formatThaiDateTime from "@/lib/Format/DateFormatThai";
import DateFormatWork from "@/lib/Format/DateForWork";
import { useRouter } from "next/navigation";

type CardWork = {
  JobId: string;
  title: string;
  description: string;
  createdAt: string;
  completedAt?: string;
  dateRange?: { startAt: string; endAt: string };
  technicianId: number[];
  status: string;
  customer: { name: string; address: string };
};

export default function History() {
  const router = useRouter();
  const [jobs, setJobs] = useState<CardWork[]>([]);
  const [techId, setTechId] = useState<number | null>(null);

  // โหลดข้อมูลจาก localStorage
  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth-storage") || "{}");
    setTechId(auth?.state?.userId);

    const cw = JSON.parse(localStorage.getItem("CardWork") || "[]");
    setJobs(cw);
  }, []);

  // -------------------------------
  // Filter เฉพาะงานที่สำเร็จของช่างคนนี้
  // -------------------------------
  const historyJobs = jobs.filter(
    (job) =>
      job.status === "สำเร็จ" && job.technicianId.includes(techId as number)
  );

  // -------------------------------
  // Group ตามวันที่เสร็จงาน (CompletedAt)
  // -------------------------------
  const groupByDate = historyJobs.reduce((acc: any, job) => {
    const dateObj = job.completedAt
      ? new Date(job.completedAt)
      : new Date(job.createdAt);

    const dateKey = dateObj.toISOString().slice(0, 10); // YYYY-MM-DD
    const dateDisplay = DateFormatWork(dateObj); // วันที่ไทย

    if (!acc[dateKey]) acc[dateKey] = { display: dateDisplay, items: [] };
    acc[dateKey].items.push(job);

    return acc;
  }, {});

  // -------------------------------
  // Sort วันที่ใหม่ → เก่า
  // -------------------------------
  const groupedDates = Object.keys(groupByDate).sort((a, b) =>
    b.localeCompare(a)
  );

  return (
    <div className="p-4">
      <div className="flex items-center mb-4 gap-2">
        <CalendarDays className="w-7 h-7 text-primary" />
        <h1 className="text-3xl font-bold text-primary">ประวัติงานของคุณ</h1>
      </div>

      {groupedDates.length === 0 && (
        <div className="text-center mt-10 text-gray-500">
          <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <p>ยังไม่มีประวัติงานสำเร็จ</p>
        </div>
      )}

      {/* Loop วันที่ */}
      {groupedDates.map((dateKey) => (
        <div key={dateKey} className="mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-2">
            {groupByDate[dateKey].display}
          </h2>

          {/* Loop งานในวันนั้น */}
          {groupByDate[dateKey].items.map((job: CardWork) => (
            <div
              key={job.JobId}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer mb-3"
              onClick={() => router.push(`/technician/${job.JobId}`)}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                
                {/* LEFT */}
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
                    เสร็จงานเมื่อ: {formatThaiDateTime(job.completedAt)}
                  </div>

                  <div className="mt-2 text-xs text-gray-500">
                    หมายเลขงาน: #{job.JobId}
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 mt-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {job.technicianId?.length} ช่าง
                    </span>
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
