"use client";

import React from "react";

const LegendRow = ({ color, label, isPulse }: any) => (
  <div className="flex items-center gap-3">
    <div className={`w-3 h-3 rounded-sm ${color} ${isPulse ? 'animate-pulse ring-2 ring-primary/20 shadow-sm' : 'shadow-inner'}`}></div>
    <span className="text-xs font-black text-gray-500 uppercase leading-none">{label}</span>
  </div>
);

export const MapLegend = () => {
  return (
    <div className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-sm border border-gray-100 space-y-2 min-w-[140px]">
      <h4 className="text-xs font-black uppercase text-gray-400 mb-2">สถานะงาน</h4>
      <div className="space-y-1.5">
        <LegendRow color="bg-emerald-500" label="เสร็จสิ้น" />
        <LegendRow color="bg-primary" label="ออนไลน์ (สด)" isPulse />
      </div>
    </div>
  );
};
