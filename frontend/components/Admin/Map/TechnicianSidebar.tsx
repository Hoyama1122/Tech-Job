"use client";

import React from "react";
import { Users } from "lucide-react";
import { TechnicianLocation } from "@/types/tracking";

interface TechnicianSidebarProps {
  techList: TechnicianLocation[];
  onlineCount: number;
  isTechOnline: (updatedAt: string) => boolean;
  onSelectTech: (tech: TechnicianLocation) => void;
}

export const TechnicianSidebar = ({ 
  techList, 
  onlineCount, 
  isTechOnline, 
  onSelectTech 
}: TechnicianSidebarProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-50 flex items-center justify-between">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 text-base">
          <Users size={20} className="text-primary" /> รายชื่อช่างวันนี้
        </h3>
        <div className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-xs font-black uppercase border border-emerald-100">
          {onlineCount} ออนไลน์
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {techList.map(tech => {
          const isOnline = tech.online !== false && isTechOnline(tech.updatedAt);
          return (
            <div 
              key={tech.userId} 
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg group transition-colors border border-transparent hover:border-gray-100 cursor-pointer"
              onClick={() => onSelectTech(tech)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-gray-200'}`}></div>
                <div>
                  <p className="text-base font-black text-gray-900 group-hover:text-primary transition-colors leading-tight uppercase">{tech.name}</p>
                  <p className="text-xs text-primary font-bold mt-1 uppercase">แผนก: {tech.departmentName || "-"}</p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">พิกัดล่าสุด: {new Date(tech.updatedAt).toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          );
        })}
        {techList.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <p className="text-xs text-gray-400">ไม่พบข้อมูลช่างในระบบ</p>
          </div>
        )}
      </div>
    </div>
  );
};
