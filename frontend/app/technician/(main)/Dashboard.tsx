"use client";
import { useEffect, useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [showFilter, setShowFilter] = useState(false);

  const [time, setTime] = useState<string>("");

  const [activeTab, setActiveTab] = useState<"today" | "week">("today");

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

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        <div className="p-6 bg-gray-300 rounded-lg">
          <p className="text-3xl">Mr. Jason John</p>
          <p className="text-m">รหัสพนักงาน 67696969</p>
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

      <div className="mt-4 bg-gray-300 rounded-lg p-3 flex justify-between">
        <div>
          <span className="text-xl">ลูกค้า : บริษัทกำลังสร้าง</span>
          <p>รายละเอียดงาน</p>
          <p>ทีม: 5หัวหน้าสมิง</p>
          <p>วันจันทร์ที่ 13 กุมภาพันธ์ 2568</p>
        </div>

        <div className="flex flex-col justify-between text-right">
          <p className="text-gray-500 text-sm">เลขที่ใบงาน : 0001</p>

          <div
            className="cursor-pointer hover:opacity-75 transition-opacity"
            onClick={goToOpenwork}
          >
            <div className="flex justify-end mr-1">
              <svg
                className="w-6 h-6 text-red-800 "
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <p>map</p>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-gray-300 rounded-lg p-3 flex justify-between">
        <div>
          <span className="text-xl">ลูกค้า : บริษัทกำลังสร้าง</span>
          <p>รายละเอียดงาน</p>
          <p>ทีม: 5หัวหน้าสมิง</p>
          <p>วันจันทร์ที่ 13 กุมภาพันธ์ 2568</p>
        </div>

        <div className="flex flex-col justify-between text-right">
          <p className="text-gray-500 text-sm">เลขที่ใบงาน : 0001</p>

          <div
            className="cursor-pointer hover:opacity-75 transition-opacity"
            onClick={goToOpenwork}
          >
            <div className="flex justify-end mr-1">
              <svg
                className="w-6 h-6 text-red-800 "
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <p>map</p>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-gray-300 rounded-lg p-3 flex justify-between">
        <div>
          <span className="text-xl">ลูกค้า : บริษัทกำลังสร้าง</span>
          <p>รายละเอียดงาน</p>
          <p>ทีม: 5หัวหน้าสมิง</p>
          <p>วันจันทร์ที่ 13 กุมภาพันธ์ 2568</p>
        </div>

        <div className="flex flex-col justify-between text-right">
          <p className="text-gray-500 text-sm">เลขที่ใบงาน : 0001</p>

          <div
            className="cursor-pointer hover:opacity-75 transition-opacity"
            onClick={goToOpenwork}
          >
            <div className="flex justify-end mr-1">
              <svg
                className="w-6 h-6 text-red-800 "
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <p>map</p>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-gray-300 rounded-lg p-3 flex justify-between">
        <div>
          <span className="text-xl">ลูกค้า : บริษัทกำลังสร้าง</span>
          <p>รายละเอียดงาน</p>
          <p>ทีม: 5หัวหน้าสมิง</p>
          <p>วันจันทร์ที่ 13 กุมภาพันธ์ 2568</p>
        </div>

        <div className="flex flex-col justify-between text-right">
          <p className="text-gray-500 text-sm">เลขที่ใบงาน : 0001</p>

          <div
            className="cursor-pointer hover:opacity-75 transition-opacity"
            onClick={goToOpenwork}
          >
            <div className="flex justify-end mr-1">
              <svg
                className="w-6 h-6 text-red-800 "
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <p>map</p>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-gray-300 rounded-lg p-3 flex justify-between">
        <div>
          <span className="text-xl">ลูกค้า : บริษัทกำลังสร้าง</span>
          <p>รายละเอียดงาน</p>
          <p>ทีม: 5หัวหน้าสมิง</p>
          <p>วันจันทร์ที่ 13 กุมภาพันธ์ 2568</p>
        </div>

        <div className="flex flex-col justify-between text-right">
          <p className="text-gray-500 text-sm">เลขที่ใบงาน : 0001</p>

          <div
            className="cursor-pointer hover:opacity-75 transition-opacity"
            onClick={goToOpenwork}
          >
            <div className="flex justify-end mr-1">
              <svg
                className="w-6 h-6 text-red-800 "
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <p>map</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;