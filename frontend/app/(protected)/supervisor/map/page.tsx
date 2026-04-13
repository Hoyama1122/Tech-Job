"use client";

import React from "react";
import AdminMap from "@/components/Admin/Map";
import { Map as MapIcon, Info } from "lucide-react";

export default function MapOverviewPage() {
  return (
    <div className="">
      {/* Header section with cleaner feel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <span className="">
              <MapIcon size={32} className="text-primary" />
            </span>
            Real-time Map Overview
          </h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">
            ติดตามตำแหน่งช่างและสถานะงานแบบเรียลไทม์บนแผนที่
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-lg text-gray-600 text-sm font-medium">
          <Info size={16} />
          <span>ตำแหน่งช่างจะอัปเดตอัตโนมัติเมื่อมีการเคลื่อนไหว</span>
        </div>
      </div>

      <AdminMap />
    </div>
  );
}
