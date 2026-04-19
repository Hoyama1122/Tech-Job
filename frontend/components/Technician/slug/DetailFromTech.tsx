import {
  FileText,
  UserCheck,
  User,
  Image as ImageIcon,
  ClipboardList,
  Search,
  Settings,
  CheckCircle,
} from "lucide-react";

import { useMemo } from "react";

interface ReportImage {
  id: number;
  url: string;
  type: "BEFORE" | "AFTER";
}

interface TechnicianReport {
  detail: string;
  inspectionResults: string;
  repairOperations: string;
  summaryOfOperatingResults: string;
  technicianSignature: string;
  customerSignature: string;
  images?: ReportImage[];
}

interface DetailFromTechProps {
  job: { technicianReport?: TechnicianReport };
  imagesBefore: string[];
  imagesAfter: string[];
}

export default function DetailFromTech({
  job,
  imagesBefore: propsBefore,
  imagesAfter: propsAfter,
}: DetailFromTechProps) {
  const report = job?.technicianReport;

  // Use props if provided, otherwise filter from report images for maximum robustness
  const displayBefore = useMemo(() => {
    if (propsBefore && propsBefore.length > 0) return propsBefore;
    return (
      report?.images
        ?.filter((img) => img.type === "BEFORE")
        .map((img) => img.url) || []
    );
  }, [propsBefore, report?.images]);

  const displayAfter = useMemo(() => {
    if (propsAfter && propsAfter.length > 0) return propsAfter;
    return (
      report?.images
        ?.filter((img) => img.type === "AFTER")
        .map((img) => img.url) || []
    );
  }, [propsAfter, report?.images]);

  const sections = useMemo(
    () => [
      {
        title: "รายละเอียดอาการ",
        content: report?.detail,
        icon: <ClipboardList className="w-5 h-5 text-blue-600" />,
      },
      {
        title: "ผลการตรวจสอบ",
        content: report?.inspectionResults,
        icon: <Search className="w-5 h-5 text-green-600" />,
      },
      {
        title: "การดำเนินการซ่อม",
        content: report?.repairOperations,
        icon: <Settings className="w-5 h-5 text-yellow-600" />,
      },
      {
        title: "สรุปผลการดำเนินงาน",
        content: report?.summaryOfOperatingResults,
        icon: <CheckCircle className="w-5 h-5 text-purple-600" />,
      },
    ],
    [report],
  );

  if (!report) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="text-center text-gray-500">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p>ยังไม่มีรายงานจากช่างเทคนิค</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8 space-y-4 mt-3">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <FileText className="w-6 h-6 text-gray-700" />
          รายงานจากช่างเทคนิค
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          ผลการดำเนินงานและรายละเอียดการซ่อม
        </p>
      </div>

      {/* Report Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <div
            key={section.title}
            className=""
          >
            <div className="flex items-center gap-2 mb-3">
              {section.icon}
              <h3 className="font-semibold text-gray-900 text-base">
                {section.title}
              </h3>
            </div>
            <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
              {section.content || "-"}
            </p>
          </div>
        ))}
      </div>

      {/* Images Section */}
      {(displayBefore.length > 0 || displayAfter.length > 0) && (
        <div className="border-t border-gray-100 pt-6 space-y-8">
          {/* BEFORE */}
          {displayBefore.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                รูปถ่ายก่อนทำงาน
                <span className="text-xs font-normal text-gray-500 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  {displayBefore.length} รูป
                </span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {displayBefore.map((img, index) => (
                  <div
                    key={index}
                    className="group relative h-32 md:h-40 overflow-hidden rounded-xl border-2 border-gray-100 bg-gray-200 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
                  >
                    <img
                      src={img}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-zoom-in"
                      onClick={() => window.open(img, "_blank")}
                      alt={`ก่อนทำงาน ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AFTER */}
          {displayAfter.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                รูปถ่ายหลังทำงาน
                <span className="text-xs font-normal text-gray-500 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                  {displayAfter.length} รูป
                </span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {displayAfter.map((img, index) => (
                  <div
                    key={index}
                    className="group relative h-32 md:h-40 overflow-hidden rounded-xl border-2 border-gray-100 bg-gray-200 shadow-sm transition-all hover:border-green-300 hover:shadow-md"
                  >
                    <img
                      src={img}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-zoom-in"
                      onClick={() => window.open(img, "_blank")}
                      alt={`หลังทำงาน ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Signatures */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
          <UserCheck className="w-5 h-5 text-green-600" />
          ลายเซ็นยืนยันรับงาน
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4 text-green-500" />
              ลายเซ็นสแตมป์ลูกค้า
            </p>
            {report.customerSignature ? (
              <div className="h-32 bg-gray-50 border-2 border-gray-100 rounded-xl p-2 flex items-center justify-center">
                <img
                  src={report.customerSignature}
                  className="max-h-full max-w-full object-contain"
                  alt="ลายเซ็นลูกค้า"
                />
              </div>
            ) : (
              <div className="h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 italic text-sm">
                ยังไม่มีการลงลายเซ็น
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
