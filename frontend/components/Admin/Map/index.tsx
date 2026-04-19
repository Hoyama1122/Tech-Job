"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const AdminMapOverviewInner = dynamic(
  () => import("./AdminMapOverview"),
  { 
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center w-full h-[600px] bg-white rounded-lg border border-gray-100 shadow-sm">
        <Loader2 className="w-10 h-10 animate-spin text-gray-900" />
        <p className="mt-4 text-gray-500 text-sm font-medium">กำลังโหลดข้อมูลแผนที่...</p>
      </div>
    )
  }
);

const AdminMap = () => {
  return <AdminMapOverviewInner />;
};

export default AdminMap;
