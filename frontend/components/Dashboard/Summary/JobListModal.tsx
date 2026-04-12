import { X, ClipboardList, Clock, Hash, Tag, User, MapPin } from "lucide-react";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { JobStatus, JobStatusThai, getStatusThai } from "@/types/job";

const JobListModal = ({ jobs, title, icon, onClose }) => {
  const modalContentRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const getStatusColor = (status: string) => {
    const s = status?.toUpperCase();
    if (s === JobStatus.PENDING || status === "รอการตรวจสอบ") return "bg-blue-100 text-blue-700 border-blue-200";
    if (s === JobStatus.IN_PROGRESS || status === "กำลังทำงาน") return "bg-yellow-100 text-yellow-700 border-yellow-200";
    if (s === JobStatus.SUBMITTED || status === "ส่งงานแล้ว") return "bg-indigo-100 text-indigo-700 border-indigo-200";
    if (s === JobStatus.COMPLETED || status === "สำเร็จ") return "bg-green-100 text-green-700 border-green-200";
    if (s === JobStatus.REJECTED || status === "ตีกลับ") return "bg-red-100 text-red-700 border-red-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalContentRef}
        className="bg-white rounded-2xl max-w-4xl w-full h-[80vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-primary/10 text-primary`}>
              {icon || <ClipboardList size={24} />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{title || "รายการใบงาน"}</h2>
              <p className="text-sm text-gray-500">ทั้งหมด {jobs.length} รายการ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          {jobs.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <ClipboardList size={48} className="mx-auto mb-4 text-gray-300" />
              <p>ไม่พบรายการที่ใบงาน</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <Link 
                  href={`/admin/work/${job.JobId || job.id}`}
                  key={job.id}
                  onClick={onClose}
                  className="group bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 rounded uppercase tracking-wider">
                        {job.JobId || `#${job.id}`}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded border ${getStatusColor(job.status)}`}>
                        {getStatusThai(job.status)}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-gray-900 mb-2 truncate group-hover:text-primary transition-colors">
                      {job.title}
                    </h3>

                    <div className="space-y-2 mt-auto">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <MapPin size={12} />
                        <span className="truncate">{job.location_name || "ไม่ระบุตำแหน่ง"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <User size={12} />
                        <span>หัวหน้า: {job.supervisor?.name || "ยังไม่ระบุ"}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListModal;
