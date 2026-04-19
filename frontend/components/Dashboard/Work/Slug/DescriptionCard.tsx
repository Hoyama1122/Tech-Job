import formatThaiDateTime from "@/lib/Format/DateFormatThai";
import { FileText, Search, Wrench, CheckCircle2 } from "lucide-react";

export default function DescriptionCard({ job }: any) {
  const latestReport =
    job?.technicianReport ||
    [...(job?.reports || [])].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0] ||
    null;

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
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          รายละเอียดงาน
        </h2>

        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {job?.description || "-"}
        </p>
      </div>

      {latestReport ? (
        <>
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
                  {latestReport?.[section.key] || "-"}
                </p>
              </div>
            ))}
          </div>

          {/* Materials and Equipment Used */}
          {latestReport?.itemUsages && latestReport.itemUsages.length > 0 && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-indigo-600" />
                วัสดุและอุปกรณ์ที่ใช้
                <span className="text-xs font-normal text-gray-500 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                  {latestReport.itemUsages.length} รายการ
                </span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {latestReport.itemUsages.map((usage: any) => (
                  <div
                    key={usage.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">
                        {usage.item.name}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-gray-500 font-mono">
                          {usage.item.code}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                            usage.item.type === "EQUIPMENT"
                              ? " text-primary"
                              : " text-accent"
                          }`}
                        >
                          {usage.item.type === "EQUIPMENT"
                            ? "อุปกรณ์"
                            : "วัสดุ"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-primary">
                        {Number(usage.usedQuantity).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-gray-500 ml-1">
                        {usage.item.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {latestReport?.start_time && (
            <div className="mt-6 border-t border-gray-100 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                เวลาในการปฏิบัติงาน
              </h2>

              <p className="text-gray-700 text-sm">
                {formatThaiDateTime(latestReport.start_time)} ถึง{" "}
                {latestReport?.end_time
                  ? formatThaiDateTime(latestReport.end_time)
                  : "กำลังดำเนินงาน"}
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500 italic">
            ยังไม่มีรายละเอียดจากช่างเทคนิค
          </p>
        </div>
      )}
    </div>
  );
}
