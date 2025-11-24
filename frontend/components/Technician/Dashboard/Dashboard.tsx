"use client";
import { use, useEffect, useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { CardWork } from "lib/Mock/Jobs";
import Link from "next/link";

const Dashboard = () => {
  const [technicianId, setTechnicianId] = useState<number | null>(null);
  const [myJobs, setMyJobs] = useState([]);
  const [jobs, setjobs] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [time, setTime] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"today" | "week">("today");



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
 
  
  const handleTabClick = (tab: "today" | "week") => {
    setActiveTab(tab);
  };

  const router = useRouter();

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

  const goToOpenwork = () => {
    router.push("/technician/Openwork");
  };

  const goToProfile = () => {
    router.push("/technician/Profile");
  };
  console.log(technicianId);
  
  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        <div className="p-6 bg-gray-300 rounded-lg">
          <p className="text-3xl">{technicianId?.name}</p>
          <p className="text-m">หรัสพนักงาน: {technicianId?.employeeCode}</p>
        </div>

        <div className="p-6 bg-gray-300 rounded-lg flex justify-between">
          <div>
            <p className="text-m">
              {new Date().toLocaleDateString("th-TH", { weekday: "long" })}
            </p>
            <p className="text-3xl">
              {new Date().toLocaleDateString("th-TH", {
                day: "2-digit",
                month: "long",
              })}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-m">เวลา</p>
            <p className="text-3xl">{time}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 justify-between flex items-center">
        <div className="inline-flex rounded-md shadow-xs" role="group">
          <button
            type="button"
            onClick={() => setActiveTab("today")}
            className={`px-4 py-2 text-sm font-medium border border-gray-200 rounded-s-lg
      ${
        activeTab === "today"
          ? "bg-blue-600 text-white"
          : "bg-white text-gray-900 opacity-50"
      }
    `}
          >
            งานวันนี้
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("week")}
            className={`px-4 py-2 text-sm font-medium border border-gray-200 rounded-e-lg
      ${
        activeTab === "week"
          ? "bg-blue-600 text-white"
          : "bg-white text-gray-900 opacity-50"
      }
    `}
          >
            งานทั้งหมด
          </button>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="px-3 py-2 bg-gray-200 rounded-lg"
          >
            Filter
          </button>

          {showFilter && (
            <div className="absolute mt-2 right-0 bg-white border rounded-lg shadow p-3 w-40">
              <p className="cursor-pointer hover:bg-gray-100 p-2 rounded">
                งานวันนี้
              </p>
              <p className="cursor-pointer hover:bg-gray-100 p-2 rounded">
                งานทั้งหมด
              </p>
              <p className="cursor-pointer hover:bg-gray-100 p-2 rounded">
                งานรออนุมัติ
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {myJobs.map((job) => (
          <div
            key={job.id}
            className="bg-gray-300 rounded-lg p-3 flex justify-between"
          >
            <div>
              <span className="text-xl">ลูกค้า : {job.customer?.name}</span>
              <p>{job.description}</p>
              <p>ทีม: {job.technicianId.join(", ")}</p>
              <p>
                {new Date(job.createdAt).toLocaleDateString("th-TH", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="flex flex-col justify-between text-right">
              <p className="text-gray-500 text-sm">เลขที่ใบงาน : {job.JobId}</p>

              <Link
                href={`/technician/${job.JobId}`}
                className="cursor-pointer hover:opacity-75 transition-opacity"
              >
                <div className="flex justify-end mr-1"></div>
                {job.status === "กำลังทำงาน" && (
                  <div className="cursor-pointer text-black bg-yellow-400 rounded-2xl p-1">
                    กำลังทำงาน
                  </div>
                )}

                {job.status === "สำเร็จ" && (
                  <div className="text-white bg-green-600 rounded-2xl p-1">
                    เสร็จสิ้นงาน
                  </div>
                )}

                {job.status === "รอการดำเนินงาน" && (
                  <div className="cursor-pointer hover:opacity-75 transition-opacity">
                    <div className="flex justify-end mr-1">
                      <svg
                        className="w-6 h-6 text-red-800"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <p>map</p>
                  </div>
                )}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
