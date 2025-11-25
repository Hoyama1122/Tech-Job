import { FileText, UserCheck, User, Image as ImageIcon, ClipboardList, Search, Settings, CheckCircle } from "lucide-react";
import { useMemo } from "react";

interface TechnicianReport {
  detail: string;
  inspectionResults: string;
  repairOperations: string;
  summaryOfOperatingResults: string;
  technicianSignature: string;
  customerSignature: string;
  images: string[];
}

interface DetailFromTechProps {
  job: {
    technicianReport?: TechnicianReport;
  };
}

export default function DetailFromTech({ job }: DetailFromTechProps) {
  const report = job?.technicianReport;

  const sections = useMemo(() => [
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
  ], [report]);

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
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8 space-y-2 mt-2">
      {/* Header */}
      <div className="border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <FileText className="w-6 h-6 text-gray-700" />
          รายงานจากช่างเทคนิค
        </h2>
        <p className="text-sm text-gray-500 mt-1">ผลการดำเนินงานและรายละเอียดการซ่อม</p>
      </div>

      {/* Report Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {sections.map((section) => (
          <div 
            key={section.title}
            className={``}
          >
            <div className="flex items-center gap-2 mb-3">
              {section.icon}
              <h3 className="font-semibold text-gray-900 text-base">{section.title}</h3>
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
          {/* Technician Signature */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-gray-700">ลายเซ็นช่าง</span>
            </div>
            {report.technicianSignature ? (
              <img 
                src={report.technicianSignature} 
                alt="ลายเซ็นช่าง" 
                className="w-full h-28 object-contain bg-gray-50 rounded-lg p-4 border border-gray-200"
              />
            ) : (
              <div className="w-full h-28 bg-gray-100 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                ไม่มีลายเซ็น
              </div>
            )}
          </div>

          {/* Customer Signature */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700">ลายเซ็นลูกค้า</span>
            </div>
            {report.customerSignature ? (
              <img 
                src={report.customerSignature} 
                alt="ลายเซ็นลูกค้า" 
                className="w-full h-28 object-contain bg-gray-50 rounded-lg p-4 border border-gray-200"
              />
            ) : (
              <div className="w-full h-28 bg-gray-100 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                ไม่มีลายเซ็น
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Images */}
      {report.images && report.images.length > 0 && (
        <div className="border-t border-gray-200 pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-purple-600" />
            รูปภาพประกอบ <span className="text-sm font-normal text-gray-500">({report.images.length} รูป)</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {report.images.map((img, index) => (
              <div key={index} className="group relative">
                <img 
                  src={img} 
                  alt={`รูปภาพ ${index + 1}`} 
                  className="w-full h-32 md:h-36 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => window.open(img, '_blank')}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}