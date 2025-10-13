"use client";

import dynamic from "next/dynamic";
import React from "react";
import Statistic from "@/components/Supervisor/Statistic";
import ReviewDashboard from "@/components/Supervisor/ReviewDashboard";
import TeamPerformance from "@/components/Supervisor/RechartsPie";
import AssignJobs from "@/components/Supervisor/AssignJobs";
import TeamStatusBoard from "@/components/Supervisor/TeamStatusBoard";

// ✅ import แบบ dynamic (ไม่ SSR)
const TeamMap = dynamic(() => import("@/components/Map/MapContainer"), {
  ssr: false,
});

const MainSupervisor = () => {
  return (
    <div className="">
      {/* ✅ Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[3.8fr_1fr] gap-4 mt-4">
        {/* ฝั่งซ้าย: การ์ดสถิติ */}
        <div className="flex flex-col">
          <Statistic />
          {/* Table */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
            <ReviewDashboard />
            <AssignJobs />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TeamStatusBoard/>
          <TeamStatusBoard/>
          </div>
        </div>

        {/* ฝั่งขวา: Team Map */}
        <div className="flex flex-col gap-4">
          <div className="shadow-xl bg-white rounded-xl min-h-[250px] p-3 md:p-4">
            <h1 className="mt-2 px-2 text-lg md:text-xl font-bold text-gray-700">
              Team Map
            </h1>
            {/* <TeamMap /> */}
          </div>

          {/* เพิ่มกราฟ/ตารางทีมได้ภายหลัง */}
          <TeamPerformance />
        </div>
      </div>
    </div>
  );
};

export default MainSupervisor;
