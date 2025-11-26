/* eslint-disable @typescript-eslint/no-explicit-any */

import formatThaiDateTime from "@/lib/Format/DateFormatThai";
import { FileText, User, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Props {
  job: {
    id?: string;
    JobId: string;
    title: string;
    description?: string;
    status: string;
    supervisor?: { name: string };
    technician?: any[];
    date: string;
  };
}

const getStatusStyle = (status: string) => {
  switch (status?.trim()) {
    case "สำเร็จ":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "กำลังทำงาน":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "ตีกลับ":
      return "bg-red-100 text-red-700 border-red-200";
    case "รอการตรวจสอบ":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "รอการดำเนินงาน":
      return "bg-orange-100 text-orange-700 border-orange-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export default function JobCard({ job }: Props) {
  const Auth = localStorage.getItem("auth-storage");

  const parsedAuth = Auth ? JSON.parse(Auth) : [];
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg  border border-gray-200 overflow-hidden group flex flex-col h-full">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/10 p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <span className="text-sm font-mono font-bold text-primary">
              #{job.JobId}
            </span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(
              job.status
            )}`}
          >
            {job.status?.trim()}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Content Area */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {job.title}
          </h3>
          {job.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {job.description}
            </p>
          )}

          {/* Metadata */}
        </div>
        <div className="space-y-3 mb-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4" />
              <span>หัวหน้างาน:</span>
            </div>
            <span className="font-medium text-gray-900">
             
              {typeof job.supervisorName === "object"
                ? job.supervisorName.name
                : job.supervisorName || "ไม่ระบุ"}
                ({job.supervisorName.department})
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>วันที่สร้าง:</span>
            </div>
            <span className="font-medium text-gray-900">
              {formatThaiDateTime(job.createdAt)}
            </span>
          </div>

          {job.technician && job.technician.length > 0 && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4" />
                <span>ช่างที่รับผิดชอบ:</span>
              </div>
              <span className="font-medium text-gray-900">
                {job.technician.length} คน
              </span>
            </div>
          )}
        </div>

     
        <Link
          href={`/executive/work/${job.JobId}`}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 hover:scale-[1.02] shadow-md hover:shadow-lg mt-auto"
        >
          ดูรายละเอียด
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
