import Link from "next/link";
import { UserCog, UserPlus, XCircle, Users2, UserCheck, ChevronLeft } from "lucide-react";

export default function AssignActionPanel({ job, onOpenModal, isAssignable, availableTechnicians }: any) {
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
          <UserCog className="w-5 h-5 text-primary" />
          ผู้รับผิดชอบงาน
        </h3>

        {job.supervisor && (
          <div className="mb-4 border-b pb-4">
            <p className="text-xs text-gray-500 mb-1">หัวหน้างานผู้ดูแล</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                {job.supervisor.name?.charAt(0)}
              </div>
              <div>
                 <span className="font-medium text-gray-800">{job.supervisor.name}</span>
                 <p className="text-xs text-gray-500">{job.supervisor.department}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* สถานะการมอบหมายช่าง */}
        <p className="text-xs text-gray-500 mb-2">สถานะช่าง</p>
        <div className="space-y-2">
            {job.technicianId && job.technicianId.length > 0 ? (
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg font-medium flex items-center gap-2">
                    <UserCheck size={18} /> มอบหมายช่างแล้ว ({job.technicianId.length} คน)
                </div>
            ) : (
                 <div className="p-3 bg-red-50 text-red-700 rounded-lg font-medium flex items-center gap-2">
                    <XCircle size={18} /> ยังไม่ถูกมอบหมายช่าง
                 </div>
            )}
            <div className="text-xs text-gray-500">
                ช่างในทีมที่พร้อมมอบหมาย: {availableTechnicians.length} คน
            </div>
        </div>
      </div>

      {/* ปุ่มดำเนินการ (Action Buttons) */}
      <div className="bg-white rounded-xl shadow-md p-6 space-y-3">
        {isAssignable ? (
          <button
            onClick={onOpenModal}
            className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/80 text-white py-3 rounded-lg shadow font-semibold transition-all duration-200"
          >
            <UserPlus className="w-5 h-5" />
            มอบหมายช่าง (ยืนยัน)
          </button>
        ) : (
          <>
            <button
                disabled
                className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg shadow font-semibold cursor-not-allowed opacity-80"
            >
                <UserCheck className="w-5 h-5" />
                มอบหมายงานสำเร็จแล้ว
            </button>
          </>
        )}
        
        {/* ปุ่มกลับหน้าหลัก */}
        <Link
          href="/supervisor/assign"
          className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold transition-all duration-200 hover:bg-gray-200"
        >
          {/* <ChevronLeft className="w-5 h-5" /> */}
          กลับไปหน้ารายการงาน
        </Link>
      </div>
    </div>
  );
}