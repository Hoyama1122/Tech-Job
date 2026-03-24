import { FileText } from "lucide-react";
import InfoRow from "./InfoRow";
import formatThaiDateTime from "@/lib/Format/DateFormatThai";
import DateFormatWork from "@/lib/Format/DateForWork";

export default function BasicInfoCard({ job }: any) {
  const statusStyle: Record<string, string> = {
    สำเร็จ: "bg-emerald-100 text-emerald-700 border-emerald-200",
    กำลังทำงาน: "bg-yellow-100 text-yellow-700 border-yellow-200",
    ตีกลับ: "bg-red-100 text-red-700 border-red-200",
    รอการตรวจสอบ: "bg-blue-100 text-blue-700 border-blue-200",
    รอการดำเนินงาน: "bg-orange-100 text-orange-700 border-orange-200",
  };

  const latestReport = job?.reports?.[0] || null;
  const locationName = job?.location?.location_name || "-";

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
        <FileText className="w-6 h-6 text-primary" />
        ข้อมูลพื้นฐาน
      </h2>

      <div className="flex flex-col md:flex-row">
        <div className="space-y-4 flex-1 px-0 md:px-4">
          <InfoRow label="หมายเลขใบงาน" value={job?.JobId ? `#${job.JobId}` : "-"} />
          <InfoRow label="ชื่องาน" value={job?.title || "-"} />
          <InfoRow
            label="สถานะ"
            value={job?.status || "-"}
            isBadge
            valueClass={statusStyle[job?.status] || ""}
          />
          <InfoRow
            label="วันที่สร้าง"
            value={job?.createdAt ? formatThaiDateTime(job.createdAt) : "-"}
          />
          <InfoRow label="สถานที่" value={locationName} />
        </div>

        <div className="space-y-4 flex-1 px-0 md:px-4 mt-4 md:mt-0">
          <InfoRow
            label="วันที่เริ่มงาน"
            value={job?.start_available_at ? DateFormatWork(job.start_available_at) : "-"}
          />
          <InfoRow
            label="วันที่สิ้นสุด"
            value={job?.end_available_at ? DateFormatWork(job.end_available_at) : "-"}
          />
          <InfoRow
            label="เสร็จสิ้น"
            value={latestReport?.end_time ? formatThaiDateTime(latestReport.end_time) : "-"}
          />
          <InfoRow
            label="แผนก"
            value={job?.department?.name || "-"}
          />
        </div>
      </div>
    </div>
  );
}