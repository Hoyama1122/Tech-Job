import formatThaiDateTime from "@/lib/Format/DateFormatThai";
import { FileText, Search, Wrench, CheckCircle2 } from "lucide-react";

export default function DescriptionCard({ job }: any) {
  if (!job.description) return null;

  const reportSections = [
    {
      title: "รายละเอียดอาการ",
      key: "detail",
      icon: <FileText className="w-5 h-5 text-blue-600" />,
    },
    {
      title: "ผลการตรวจสอบ",
      key: "inspectionResults",
      icon: <Search className="w-5 h-5 text-green-600" />,
    },
    {
      title: "การดำเนินการซ่อม",
      key: "repairOperations",
      icon: <Wrench className="w-5 h-5 text-yellow-600" />,
    },
    {
      title: "สรุปผลการดำเนินงาน",
      key: "summaryOfOperatingResults",
      icon: <CheckCircle2 className="w-5 h-5 text-purple-600" />,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Job Description */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          รายละเอียดงาน
        </h2>

        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {job.description}
        </p>
      </div>

      {/* Technician Report */}
      {job.technicianReport ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {reportSections.map((section) => (
            <div key={section.key}>
              <div className="flex items-center gap-2 mb-2">
                {section.icon}
                <h3 className="font-semibold text-gray-900 text-sm tracking-wide">
                  {section.title}
                </h3>
              </div>

              <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed min-h-[60px]">
                {job.technicianReport?.[section.key] || "-"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500 italic">
            ยังไม่มีรายละเอียดจากช่างเทคนิค
          </p>
        </div>
      )}
      <div>
        {job.technicianReport?.startTime && (
          <div className="mt-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              เวลาในการปฏิบัติงาน
            </h2>

            <p className="text-gray-700 text-sm">
              {formatThaiDateTime(job.technicianReport.startTime)} ถึง{" "}
              {job.technicianReport?.endTime
                ? formatThaiDateTime(job.technicianReport.endTime)
                : "กำลังดำเนินงาน"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
