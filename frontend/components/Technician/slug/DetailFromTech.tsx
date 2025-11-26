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

interface TechnicianReport {
  detail: string;
  inspectionResults: string;
  repairOperations: string;
  summaryOfOperatingResults: string;
  technicianSignature: string;
  customerSignature: string;

  imagesBeforeKey?: string;
  imagesAfterKey?: string;
}

interface DetailFromTechProps {
  job: { technicianReport?: TechnicianReport };

 
  imagesBefore: string[];
  imagesAfter: string[];
}

export default function DetailFromTech({
  job,
  imagesBefore,
  imagesAfter,
}: DetailFromTechProps) {
  const report = job?.technicianReport;

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
    [report]
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
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8 space-y-2 mt-3">
      {/* Header */}
      <div className="border-b border-gray-200 pb-3">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <FileText className="w-6 h-6 text-gray-700" />
          รายงานจากช่างเทคนิค
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          ผลการดำเนินงานและรายละเอียดการซ่อม
        </p>
      </div>

      {/* Report Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="flex items-center gap-2 mb-2">
              {section.icon}
              <h3 className="font-semibold text-gray-900 text-base">
                {section.title}
              </h3>
            </div>
            <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed min-h-[60px]">
              {section.content || "-"}
            </p>
          </div>
        ))}
      </div>

      {/* Signatures */}
      <div className="border-t border-gray-200 pt-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-green-600" />
          ลายเซ็นยืนยัน
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Technician */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              ลายเซ็นช่าง
            </p>
            {report.technicianSignature ? (
              <img
                src={report.technicianSignature}
                className="w-full h-28 object-contain bg-gray-50 rounded-lg p-4 border"
              />
            ) : (
              <div className="w-full h-28 bg-gray-100 rounded-lg border border-dashed flex items-center justify-center text-gray-400">
                ไม่มีลายเซ็น
              </div>
            )}
          </div>

          {/* Customer */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4 text-green-500" />
              ลายเซ็นลูกค้า
            </p>
            {report.customerSignature ? (
              <img
                src={report.customerSignature}
                className="w-full h-28 object-contain bg-gray-50 rounded-lg p-4 border"
              />
            ) : (
              <div className="w-full h-28 bg-gray-100 rounded-lg border border-dashed flex items-center justify-center text-gray-400">
                ไม่มีลายเซ็น
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="space-y-6">
        {/* BEFORE */}
        {imagesBefore.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-blue-600" />
              รูปก่อนทำงาน
              <span className="text-sm text-gray-500">
                ({imagesBefore.length} รูป)
              </span>
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
              {imagesBefore.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  className="w-full h-32 md:h-36 object-cover rounded-lg shadow cursor-pointer"
                  onClick={() => window.open(img, "_blank")}
                />
              ))}
            </div>
          </div>
        )}

        {/* AFTER */}
        {imagesAfter.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-green-600" />
              รูปหลังทำงาน
              <span className="text-sm text-gray-500">
                ({imagesAfter.length} รูป)
              </span>
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
              {imagesAfter.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  className="w-full h-32 md:h-36 object-cover rounded-lg shadow cursor-pointer"
                  onClick={() => window.open(img, "_blank")}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
