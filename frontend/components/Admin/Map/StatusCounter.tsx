"use client";

import React from "react";
import { Clock, Briefcase, Signal, CheckCircle2, Users } from "lucide-react";
import { JobStatus, JobLocation } from "@/types/tracking";

interface StatusCounterProps {
  jobs: JobLocation[];
  onlineCount: number;
}

const colorMap: Record<string, { bg: string, text: string, iconBg: string, iconText: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-700", iconBg: "bg-blue-100", iconText: "text-blue-600" },
  green: { bg: "bg-green-50", text: "text-green-700", iconBg: "bg-green-100", iconText: "text-green-600" },
  primary: { bg: "bg-primary/5", text: "text-primary", iconBg: "bg-primary/10", iconText: "text-primary" },
  amber: { bg: "bg-amber-50", text: "text-amber-700", iconBg: "bg-amber-100", iconText: "text-amber-600" },
  sky: { bg: "bg-sky-50", text: "text-sky-700", iconBg: "bg-sky-100", iconText: "text-sky-600" },
};

const StatusCard = ({ label, value, icon, colorClass }: any) => {
  const styles = colorMap[colorClass] || colorMap.blue;
  return (
    <div className={`flex items-center justify-between p-5 rounded-lg border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5`}>
      <div className="min-w-0">
        <p className={`text-xs font-black text-gray-300 mb-1 uppercase truncate`}>{label}</p>
        <p className={`text-3xl font-black text-gray-900`}>{value}</p>
      </div>
      <div className={`p-2.5 ${styles.iconBg} ${styles.iconText} rounded-md shadow-sm border border-black/5`}>
        {icon}
      </div>
    </div>
  );
};

export const StatusCounter = ({ jobs, onlineCount }: StatusCounterProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <StatusCard
        label="รอดำเนินงาน"
        value={jobs.filter(j => j.status === "PENDING").length}
        icon={<Clock className="w-5 h-5" />}
        colorClass="amber"
      />
      <StatusCard
        label="กำลังทำ"
        value={jobs.filter(j => j.status === "IN_PROGRESS").length}
        icon={<Briefcase className="w-5 h-5" />}
        colorClass="blue"
      />
      <StatusCard
        label="รอตรวจสอบ"
        value={jobs.filter(j => j.reportStatus === "SUBMITTED").length}
        icon={<Signal className="w-5 h-5" />}
        colorClass="sky"
      />
      <StatusCard
        label="สำเร็จ"
        value={jobs.filter(j => j.status === "COMPLETED").length}
        icon={<CheckCircle2 className="w-5 h-5" />}
        colorClass="green"
      />
      <StatusCard
        label="ช่างออนไลน์"
        value={onlineCount}
        icon={<Users className="w-5 h-5" />}
        colorClass="primary"
      />
    </div>
  );
};
