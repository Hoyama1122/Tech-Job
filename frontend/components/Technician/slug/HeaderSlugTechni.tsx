import formatThaiDateTime from "@/lib/Format/DateFormatThai";
import { Clock, FileText } from "lucide-react";
import React from "react";

const HeaderSlugTechni = ({ job, getStatusBadge }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="bg-primary/20 rounded-lg p-3">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              ลูกค้า: {job.customer?.name || "ไม่ระบุ"}
            </h1>
            <p className="text-gray-500">
              หมายเลขงาน: <span className="font-mono">#{job.JobId}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {formatThaiDateTime(job.createdAt)}
            </span>
          </div>
          {getStatusBadge(job.status)}
        </div>
      </div>
    </div>
  );
};

export default HeaderSlugTechni;
