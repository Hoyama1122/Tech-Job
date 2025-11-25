import formatThaiDateTime from "@/lib/Format/DateFormatThai";
import { ChevronRight, FileText, MapPin, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const Jobs = ({ displayJobs, activeTab }) => {
  const getStatusBadge = (status: string) => {
    const styles = {
      กำลังทำงาน: "bg-yellow-100 text-yellow-700 border-yellow-200",
      สำเร็จ: "bg-green-100 text-green-700 border-green-200",
      รอการดำเนินงาน: "bg-orange-100 text-orange-700 border-orange-200",
      รอการตรวจสอบ: "bg-blue-100 text-blue-700 border-blue-200",
    };

    const defaultStyle = "bg-gray-100 text-gray-700 border-gray-200";

    return (
      <span
        className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
          styles[status] || defaultStyle
        }`}
      >
        {status}
      </span>
    );
  };
  const router = useRouter();

  return (
    <div className="space-y-3">
      {displayJobs.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">
            {activeTab === "today" ? "ไม่มีงานในวันนี้" : "ไม่พบงานที่มอบหมาย"}
          </p>
        </div>
      ) : (
        displayJobs.map((job: any) => (
          <div
            key={job.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer"
            onClick={() => router.push(`/technician/${job.JobId}`)}
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-2">
                  <div className="bg-primary/20 rounded-lg p-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      ลูกค้า: {job.customer?.name || "ไม่ระบุ"}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {job.description}
                    </p>
                  </div>
                </div>

                <div className="flex  mt-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-primary" />
                    {job.customer?.address || "ไม่ระบุสถานที่"}
                  </span>
                </div>
                <div className="">{formatThaiDateTime(job.createdAt)}</div>

                <div className="mt-2 text-xs text-gray-500">
                  หมายเลขงาน: #{job.JobId}
                </div>
              </div>

              <div className="flex items-center justify-between  gap-2">
                <div className="flex items-center gap-1 mt-1">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {job.technicianId?.length} ช่าง
                  </span>
                </div>
                <div className="flex items-center">
                  {getStatusBadge(job.status)}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Jobs;
