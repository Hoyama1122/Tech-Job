import { X, Phone, Mail, Building, User, Hash, Filter } from "lucide-react";
import { useEffect, useRef, useState, useMemo } from "react";

const SupervisorListModal = ({ supervisors, onClose }) => {
  const modalContentRef = useRef(null);
  const [selectedDepartment, setSelectedDepartment] = useState('all');

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

  // Get unique departments for filter
  const departments = useMemo(() => {
    const deptSet = new Set(supervisors.map(s => s.department).filter(Boolean));
    return Array.from(deptSet).sort();
  }, [supervisors]);

  // Filter supervisors
  const filteredSupervisors = useMemo(() => {
    if (selectedDepartment === 'all') return supervisors;
    return supervisors.filter(s => s.department === selectedDepartment);
  }, [supervisors, selectedDepartment]);

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
        <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-200 shadow-sm">
          <h2 id="modal-title" className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <User size={20} className="text-purple-600" />
            </div>
            รายชื่อหัวหน้างานทั้งหมด
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full cursor-pointer text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filter Section */}
        {departments.length > 0 && (
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Filter size={16} className="text-gray-500" />
                <label htmlFor="supervisor-department-filter" className="text-sm font-medium text-gray-700">
                  แผนก:
                </label>
                <select
                  id="supervisor-department-filter"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="all">ทั้งหมด</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-medium">{filteredSupervisors.length}</span> คน
              </div>
            </div>
          </div>
        )}

        {/* List Container */}
        <div className="flex-1 overflow-y-auto p-6 pt-4">
          {filteredSupervisors.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <User size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-1">
                {selectedDepartment === 'all' ? 'ไม่พบข้อมูลหัวหน้างาน' : 'ไม่พบหัวหน้างานในแผนกที่เลือก'}
              </p>
              <p className="text-sm">กรุณาตรวจสอบข้อมูลอีกครั้ง</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {filteredSupervisors.map((supervisor) => (
                <li 
                  key={supervisor.id} 
                  className="group bg-white hover:shadow-lg transition-all duration-200 rounded-lg p-5 border border-gray-200 hover:border-purple-300 hover:shadow-purple-100"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Avatar & ID */}
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-50 to-purple-100 rounded-full flex items-center justify-center group-hover:from-purple-100 group-hover:to-purple-200 transition-colors">
                            <User size={28} className="text-purple-600" />
                          </div>
                          <div className="absolute -bottom-1 -right-1 bg-white px-2 py-0.5 rounded-full border border-gray-200 shadow-sm">
                            <span className="text-xs font-bold text-gray-700 flex items-center gap-0.5">
                              <Hash size={10} className="text-gray-500" />
                              {supervisor.id}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Main Info */}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-gray-900 text-xl mb-2 truncate">
                          {supervisor.name}
                        </h3>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                          <span className="flex items-center gap-2 font-medium">
                            <Building size={14} className="text-gray-400" />
                            {supervisor.department}
                          </span>
                          {supervisor.team && (
                            <span className="flex items-center gap-2">
                              <Users size={14} className="text-gray-400" />
                              ทีม: {supervisor.team}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Role Badge */}
                    <div className="flex-shrink-0 ml-4">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 uppercase tracking-wider">
                        {supervisor.role === 'supervisor' ? 'หัวหน้างาน' : supervisor.role}
                      </span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="mt-5 pt-4 border-t border-gray-200 flex flex-wrap gap-6 text-sm">
                    <a 
                      href={`tel:${supervisor.phone}`} 
                      className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors font-medium"
                    >
                      <Phone size={16} className="text-gray-400" />
                      {supervisor.phone}
                    </a>
                    <a 
                      href={`mailto:${supervisor.email}`} 
                      className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors font-medium"
                    >
                      <Mail size={16} className="text-gray-400" />
                      <span className="truncate max-w-xs">{supervisor.email}</span>
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



export default SupervisorListModal;