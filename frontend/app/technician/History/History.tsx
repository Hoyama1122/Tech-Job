"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  MapPin,
  Users,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import DateFormatWork from "@/lib/Format/DateForWork";
import formatThaiDateTime from "@/lib/Format/DateFormatThai";
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
  const [techId, setTechId] = useState<number | null>(null);
  const [jobs, setJobs] = useState<CardWork[]>([]);

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth-storage") || "{}");
    const userId = auth?.state?.userId;
    setTechId(userId);

    const workList = JSON.parse(localStorage.getItem("CardWork") || "[]");
    setJobs(workList);
  }, []);

  const historyJobs = jobs.filter(
    (job) => job.status === "สำเร็จ" && job.technicianId.includes(techId)
  );

  // ถ้าไม่เจองานสำเร็จเลย
  if (historyJobs.length === 0) {
    return (
      <div className="p-4 text-center mt-10 text-gray-500">
        <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <p className="text-lg">ยังไม่มีประวัติงาน</p>
      </div>
    );
  }

  const grouped = historyJobs.reduce((acc: any, job) => {
    const date = job.completedAt || job.createdAt;
    const dateKey = date.slice(0, 10);
    const dateDisplay = DateFormatWork(date);

    if (!acc[dateKey]) acc[dateKey] = { dateDisplay, list: [] };
    acc[dateKey].list.push(job);

    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center mb-4 gap-2">
        <CalendarDays className="w-7 h-7 text-primary" />
        <h1 className="text-3xl font-bold text-primary">ประวัติงานของคุณ</h1>
      </div>

      {/* แต่ละวัน */}
      {sortedDates.map((dateKey) => {
        const group = grouped[dateKey];
        return (
          <div key={dateKey} className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-3">
              {group.dateDisplay}
            </h2>
            {/* รายการงาน */}
            {group.list.map((job: CardWork) => (
              <div
                key={job.JobId}
                className="bg-white rounded-xl p-6 shadow-sm   transition cursor-pointer mb-3"
                onClick={() => router.push(`/technician/${job.JobId}`)}
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  {/* LEFT */}
                  <div className="flex-1">
                    <div className="flex gap-3 items-start mb-2">
                      <div className="bg-primary/20 rounded-lg p-2">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          ลูกค้า: {job.customer?.name}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {job.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      {job.customer?.address}
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      เสร็จงานเมื่อ: {formatThaiDateTime(job.completedAt)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      หมายเลขงาน: #{job.JobId}
                    </div>
                  </div>
                  {/* RIGHT */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <Users className="w-4 h-4" />
                      {job.technicianId.length} ช่าง
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
