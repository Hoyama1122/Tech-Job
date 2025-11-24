import { FileText } from "lucide-react";
import InfoRow from "./InfoRow";
import DateFormat from "@/lib/Format/DateForm";
import formatThaiDateTime from "@/lib/Format/DateFormatThai";

export default function BasicInfoCard({ job }: any) {
  const statusStyle = {
    สำเร็จ: "bg-emerald-100 text-emerald-700 border-emerald-200",
    กำลังทำงาน: "bg-yellow-100 text-yellow-700 border-yellow-200",
    ตีกลับ: "bg-red-100 text-red-700 border-red-200",
    รอการตรวจสอบ: "bg-blue-100 text-blue-700 border-blue-200",
    รอการดำเนินงาน: "bg-purple-100 text-purple-700 border-purple-200",
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
        <FileText className="w-6 h-6 text-primary" />
        ข้อมูลพื้นฐาน
      </h2>

      <div className="flex">
        <div className="space-y-4  flex-1 px-4">
          <InfoRow label="หมายเลขใบงาน" value={`#${job.JobId}`} />
          <InfoRow label="ชื่องาน" value={job.title} />
          <InfoRow
            label="สถานะ"
            value={job.status}
            isBadge
            valueClass={statusStyle[job.status] || ""}
          />
          <InfoRow
            label="วันที่สร้าง"
            value={formatThaiDateTime(job.createdAt) || "-"}
          />
          {job.location && <InfoRow label="สถานที่" value={job.location} />}
        </div>
        <div className="space-y-4  flex-1 px-4">
          <InfoRow label="วันที่เริ่มงาน" value={DateFormat(job.dateRange.startAt) || "-"} />
          <InfoRow label="วันที่สิ้นสุด" value={DateFormat(job.dateRange.endAt) || "-"} />
          <InfoRow label="เสร็จสิ้น" value={formatThaiDateTime(job.completedAt) || "-"} />
       
          {job.customer?.address && <InfoRow label="สถานที่" value={job.customer?.address} />}
        </div>
      </div>
    </div>
  );
}
