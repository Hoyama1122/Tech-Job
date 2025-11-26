import { Building, Hash, Mail, Phone, User, UserCheck, Users, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";


const TechnicianListModalDepartment = ( { technicians, onClose }: { technicians: any[], onClose: () => void }) => {
  const modalContentRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e: any) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    }
  }, [onClose]);
  
  const handleBackdropClick = (e: any) => {
    if (e.target === e.currentTarget) onClose();
  };

  const displayedTechnicians = technicians;

  const departmentName = displayedTechnicians.length > 0
    ? displayedTechnicians[0].department
    : "แผนกที่ดูแล";


  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalContentRef}
        className="bg-white rounded-xl max-w-3xl w-full h-[800px] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4  border-b border-gray-200 shadow-sm">
          <h2
            id="modal-title"
            className="text-xl font-bold text-gray-900 flex items-center gap-2"
          >
            <div className="w-8 h-8  rounded-full flex items-center justify-center bg-primary/10">
              <User size={20} className="text-primary" />
            </div>
            รายชื่อช่าง **แผนก{departmentName}** </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full cursor-pointer text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* *** ลบส่วน Filter ทั้งหมดออก *** */}
        
        {/* Summary (ย้ายมาแทนที่ส่วน Filter เพื่อบอกจำนวน) */}
        <div className="mt-4 px-6 pb-4 border-b border-gray-100"> 
            <div className="flex items-center gap-1 text-lg text-gray-600">
                <User size={18} className="text-primary" />
                <span className="font-semibold text-gray-800">
                    {displayedTechnicians.length}
                </span>
                <span>คนในแผนกนี้</span>
            </div>
        </div>
        
        {/* List Container */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {displayedTechnicians.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users size={48} className="mx-auto mb-4 text-gray-300" />
              <p>ไม่พบข้อมูลช่างในแผนกนี้</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {displayedTechnicians.map((technician) => ( // ใช้อาร์เรย์ที่ถูกกรองแล้ว
                <li
                  key={technician.id}
                  className="group bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-200 rounded-lg p-4 border border-gray-200 hover:border-gray-300"
                >
                  {/* ... เนื้อหา Technician Card ยังคงเดิม ... */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {/* Avatar & ID */}
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition-colors">
                            <UserCheck size={24} className="text-blue-600" />
                          </div>
                          <div className="absolute -bottom-1 -right-1 bg-white px-1.5 py-0.5 rounded-full border border-gray-200 shadow-sm">
                            <span className="text-xs font-bold text-gray-700">
                              <Hash size={10} className="inline" />
                              {technician.id}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Main Info */}
                      <div className="min-w-0 flex-1 ">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">
                          {technician.name}
                        </h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1.5">
                            <Building size={14} className="text-gray-400" />
                            {technician.department}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users size={14} className="text-gray-400" />
                            {technician.team}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-medium bg-primary text-white capitalize">
                        {technician.department === "technician"
                          ? "ช่างเทคนิค"
                          : technician.department}
                      </span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="mt-4 pt-3 border-t border-gray-200 flex flex-wrap gap-4 text-sm">
                    <a
                      href={`tel:${technician.phone}`}
                      className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Phone size={14} className="text-gray-400" />
                      {technician.phone}
                    </a>
                    <a
                      href={`mailto:${technician.email}`}
                      className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Mail size={14} className="text-gray-400" />
                      <span className="truncate max-w-xs">
                        {technician.email}
                      </span>
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicianListModalDepartment;