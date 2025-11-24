"use client";
import { useEffect, useState } from "react";
import React from "react";
import { Briefcase, CheckCircle2, ClipboardClock, Clock4 } from "lucide-react";
import DateTime from "./DateTime";
import FilterJobs from "./Filter";
import { useRouter } from "next/navigation";
import formatThaiDateTime from "@/lib/Format/DateFormatThai";
import Jobs from "./Jobs";

const Dashboard = () => {
  const [technicianId, setTechnicianId] = useState<number | null>(null);
  const [myJobs, setMyJobs] = useState([]);
  const [jobs, setjobs] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [time, setTime] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"today" | "week">("today");
  const router = useRouter();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("auth-storage");
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (parsed?.state) {
        setTechnicianId(parsed.state);
      }
    } catch (err) {
      console.error("โหลด user จาก auth-storage fail", err);
    }
  }, []);

  useEffect(() => {
    const cardData = localStorage.getItem("CardWork");
    if (!cardData) return;

    const parsed = JSON.parse(cardData);
    setjobs(parsed);
  }, []);

  // ดึงงานตาม technicianId
  useEffect(() => {
    if (technicianId == null) return;

    const my = jobs.filter((job: any) =>
      job.technicianId?.includes(technicianId?.userId)
    );

    setMyJobs(my);
  }, [technicianId, jobs]);

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

  console.log(technicianId);

  const todayJobs = myJobs.filter((job: any) => {
    const jobDate = new Date(job.createdAt).toDateString();
    const today = new Date().toDateString();
    return jobDate === today;
  });
  const displayJobs = activeTab === "today" ? todayJobs : myJobs;
  return (
    <div className="max-w-6xl mx-auto p-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
        {/* Header */}
        {/* <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold">คุณ{technicianId?.name}</h2>
              <p className=" text-sm">รหัสพนักงาน: {technicianId?.employeeCode}</p>
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <User className="w-6 h-6" />
            </div>
          </div>
        </div> */}
        {/* Date */}
        <DateTime time={time} />

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
          {/* Today */}
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
          {/* All Jobs */}
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
          {/*  Success */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-lg p-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {myJobs.filter((j: any) => j.status === "สำเร็จ").length}
                </p>
                <p className="text-xs text-gray-500">เสร็จสิ้น</p>
              </div>
            </div>
          </div>
          {/* Pending */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 rounded-lg p-2">
                <ClipboardClock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    myJobs.filter((j: any) => j.status === "รอการตรวจสอบ")
                      .length
                  }
                </p>
                <p className="text-xs text-gray-500">รอการตรวจสอบ</p>
              </div>
            </div>
          </div>
        </div>
        {/* Tabs and Filter */}
        <FilterJobs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          showFilter={showFilter}
          setShowFilter={setShowFilter}
        />
      </div>
      {/* Jobs List */}
      <Jobs displayJobs={displayJobs} activeTab={activeTab} />
    </div>
  );
};

export default Dashboard;
