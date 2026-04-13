"use client";

import React from "react";
import AdminMap from "@/components/Admin/Map";
import { Map as MapIcon, Info, Clock4 } from "lucide-react";

export default function MapOverviewPage() {
  const [now, setNow] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("th-TH", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }) + " น.";
  };

  return (
    <div className="space-y-4">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2D3748] flex items-center gap-2">
            <MapIcon size={24} className="text-[#2D3748]" />
            Map Overview
          </h1>
          <p className="text-sm text-gray-500">
            Track real-time technician locations and job status
          </p>
        </div>
        
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 text-sm font-medium text-gray-700">
          <Clock4 size={18} className="text-indigo-500" />
          <span>{formatDate(now)}</span>
        </div>
      </div>

      <AdminMap />
    </div>
  );
}
