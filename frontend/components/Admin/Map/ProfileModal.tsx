"use client";

import React from "react";
import { X, UserCircle, Users, Mail, Phone, Clock } from "lucide-react";
import { TechnicianLocation } from "@/types/tracking";

interface ProfileModalProps {
  tech: TechnicianLocation | null;
  onClose: () => void;
  isTechOnline: (updatedAt: string) => boolean;
}

const DetailItem = ({ icon, label, value }: any) => (
  <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-lg border border-gray-100/50">
    <div className="text-gray-400">{icon}</div>
    <div className="min-w-0">
      <p className="text-[10px] font-black text-gray-400 uppercase">{label}</p>
      <p className="text-sm font-bold text-gray-700 truncate">{value}</p>
    </div>
  </div>
);

export const ProfileModal = ({ tech, onClose, isTechOnline }: ProfileModalProps) => {
  if (!tech) return null;

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-gray-900/60 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden animate-scaleIn border border-gray-100">
        {/* Minimal Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100">
           <h3 className="text-sm font-black text-gray-400 uppercase">ข้อมูลโปรไฟล์ช่าง</h3>
           <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-50 text-gray-400 rounded-md transition-all active:scale-95 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          <div className="flex items-start gap-5 mb-8">
            <div className="relative">
              <div className="w-20 h-20 bg-gray-50 rounded-lg border border-gray-100 p-0.5 flex items-center justify-center text-primary shadow-inner">
                {tech.avatar ? (
                  <img src={tech.avatar} alt="" className="w-full h-full object-cover rounded-[6px]" />
                ) : (
                  <UserCircle size={40} className="text-gray-200" />
                )}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 border-4 border-white rounded-full ${isTechOnline(tech.updatedAt) ? 'bg-emerald-500 shadow-sm' : 'bg-gray-300'}`}></div>
            </div>
            <div className="flex-1">
              <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-2">{tech.name}</h4>
              <div className="inline-flex items-center px-3 py-1 bg-primary text-white text-xs font-black rounded uppercase mb-2">
                {tech.role}
              </div>
              <p className="text-sm font-black text-primary uppercase">แผนก: {tech.departmentName || "ทั่วไป"}</p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 gap-2 mb-8">
            <DetailItem icon={<Users size={14}/>} label="รหัสพนักงาน" value={tech.empno || "ไม่ระบุ"} />
            <DetailItem icon={<Mail size={14}/>} label="อีเมล" value={tech.email || "ไม่ระบุ"} />
            <DetailItem icon={<Phone size={14}/>} label="เบอร์โทรศัพท์" value={tech.phone || "ไม่ระบุ"} />
            <DetailItem icon={<Clock size={14}/>} label="พิกัดล่าสุดเมื่อ" value={new Date(tech.updatedAt).toLocaleString('th-TH', { 
                dateStyle: 'short', 
                timeStyle: 'short' 
              })} />
          </div>

          <button 
            onClick={onClose}
            className="w-full py-4  cursor-pointer bg-gray-900 text-white rounded font-black text-sm uppercase shadow-lg shadow-gray-200 hover:bg-black transition-all active:translate-y-0.5"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
