"use client";
import { useEffect, useState } from "react";
import React from "react";
import { Briefcase, CheckCircle2, ClipboardClock, Clock4 } from "lucide-react";
import DateTime from "./DateTime";
import FilterJobs from "./Filter";
import { useRouter } from "next/navigation";
import formatThaiDateTime from "@/lib/Format/DateFormatThai";
import Jobs from "./Jobs";
import { jobService } from "@/services/job.service";
import { JobStatus, getStatusThai, JobStatusThai } from "@/types/job";

import { useJobStore } from "@/store/useJobStore";

const Dashboard = () => {
  const { myJobs, fetchMyJobs, isMyJobsLoading } = useJobStore();
  const [showFilter, setShowFilter] = useState(false);
  const [time, setTime] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"today" | "all">("today");
  const router = useRouter();

  useEffect(() => {
    fetchMyJobs();
  }, [fetchMyJobs]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setTime(formattedTime);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  const todayJobs = myJobs.filter((job: any) => {
    if (!job.start_available_at || !job.end_available_at) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(job.start_available_at);
    start.setHours(0, 0, 0, 0);

    const end = new Date(job.end_available_at);
    end.setHours(23, 59, 59, 999);

    return today >= start && today <= end;
  });

  const displayJobs = activeTab === "today" ? todayJobs : myJobs;

  return (
    <div className="max-w-6xl mx-auto p-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
        <DateTime time={time} />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
          <div className="bg-white rounded-[8px] p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 rounded-[8px] p-2">
                <Clock4 className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {todayJobs.length}
                </p>
                <p className="text-xs text-gray-500">งานวันนี้</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[8px] p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-[8px] p-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {myJobs.length}
                </p>
                <p className="text-xs text-gray-500">งานทั้งหมด</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[8px] p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-[8px] p-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    myJobs.filter(
                      (j: any) =>
                        j.status === JobStatus.COMPLETED ||
                        j.status === JobStatus.APPROVED ||
                        j.status === "สำเร็จ" ||
                        j.status === "อนุมัติแล้ว"
                    ).length
                  }
                </p>
                <p className="text-xs text-gray-500">เสร็จสิ้น</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[8px] p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 rounded-[8px] p-2">
                <ClipboardClock className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    myJobs.filter(
                      (j: any) =>
                        j.status === JobStatus.SUBMITTED ||
                        j.status === "รอการตรวจสอบ"
                    ).length
                  }
                </p>
                <p className="text-xs text-gray-500">รอตรวจสอบ</p>
              </div>
            </div>
          </div>
        </div>

        <FilterJobs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          showFilter={showFilter}
          setShowFilter={setShowFilter}
        />
      </div>

      <Jobs displayJobs={displayJobs} activeTab={activeTab} />
    </div>
  );
};

export default Dashboard;
