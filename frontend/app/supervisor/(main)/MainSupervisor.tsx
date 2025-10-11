"use client";

import dynamic from "next/dynamic";
import React from "react";
import Statistic from "@/components/Supervisor/Statistic";

// ✅ import แบบ dynamic (ไม่ SSR)
const TeamMap = dynamic(() => import("@/components/Map/MapContainer"), {
  ssr: false,
});

const MainSupervisor = () => {
  const members = [
    { id: 1, name: "ช่างเอ", lat: 13.855, lng: 100.585, status: "กำลังทำงาน" },
    { id: 2, name: "ช่างบี", lat: 13.845, lng: 100.59, status: "ว่าง" },
    { id: 3, name: "ช่างซี", lat: 13.841, lng: 100.598, status: "รอตรวจสอบ" },
  ];

  return (
    <div className="">
      {/* ✅ Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-[3.5fr_1fr] gap-4 mt-4">
        {/* ฝั่งซ้าย: การ์ดสถิติ */}
        <Statistic />

        {/* ฝั่งขวา: Team Map */}
        <div className="flex flex-col gap-4">
          <div className="shadow-xl bg-white rounded-xl min-h-[250px] p-2">
            <h1 className="mt-2 px-2 text-xl font-bold text-gray-700">
              Team Map
            </h1>
            <TeamMap />
          </div>

          {/* เพิ่มกราฟ/ตารางทีมได้ภายหลัง */}
          <div className="shadow bg-white rounded-lg p-4 text-center">
            Team Performance
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSupervisor;
