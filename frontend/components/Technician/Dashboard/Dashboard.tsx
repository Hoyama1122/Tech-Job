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

const Dashboard = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [jobs, setjobs] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [time, setTime] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"today" | "all">("today");
  const router = useRouter();

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const data = await jobService.getMyJobs();
        setMyJobs(data.jobs || []);
        setjobs(data.jobs || []);
      } catch (err) {
        console.error("โหลดงานของ technician ไม่สำเร็จ", err);
      }
    };

    fetchMyJobs();
  }, []);

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
    const jobDate = new Date(job.createdAt).toDateString();
    const today = new Date().toDateString();
    return jobDate === today;
  });

  const displayJobs = activeTab === "today" ? todayJobs : myJobs;

  return (
    <div className="max-w-6xl mx-auto p-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
        <DateTime time={time} />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 rounded-lg p-2">
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

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-lg p-2">
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

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-lg p-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    myJobs.filter(
                      (j: any) =>
                        j.status === "สำเร็จ" || j.status === "COMPLETED"
                    ).length
                  }
                </p>
                <p className="text-xs text-gray-500">เสร็จสิ้น</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 rounded-lg p-2">
                <ClipboardClock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    myJobs.filter(
                      (j: any) =>
                        j.status === "รอการตรวจสอบ" || j.status === "PENDING"
                    ).length
                  }
                </p>
                <p className="text-xs text-gray-500">รอการตรวจสอบ</p>
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
