"use client";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { NavNotifacation } from "@/lib/Mock/NavNotifacation";


interface NotificationBellProps {
  notifications: Notification[];
  onClose: () => void;
}

const NotificationBell = ({ notifications, onClose }: NotificationBellProps) => {
  // หยุดการ bubbling เมื่อคลิกภายใน dropdown
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return createPortal(
    <>
      {/* Overlay ด้านหลัง - คลิกเพื่อปิด */}
      <div
        className="fixed inset-0 z-[9999] bg-black/30 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Dropdown Container */}
      <div
        className="fixed top-16 right-4 z-[10000] w-[380px] max-w-[90vw] md:max-w-[450px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 ease-out transform scale-100 opacity-100"
        onClick={handleDropdownClick}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold text-xl text-gray-800">การแจ้งเตือน</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Notification List */}
        <div className="max-h-96 overflow-y-auto">
          {NavNotifacation.length > 0 ? (
            NavNotifacation.map((notif) => (
              <div
                key={notif.id}
                className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors ${
                  notif.unread ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                }`}
              >
                <p className="text-sm text-gray-800 font-medium leading-relaxed">
                  {notif.message}
                </p>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                  <span>{notif.time}</span>
                  {!notif.unread && (
                    <span className="text-green-600">✓ อ่านแล้ว</span>
                  )}
                </p>
              </div>
            ))
          ) : (
            <div className="px-4 py-8 text-center text-gray-400">
              <p>ไม่มีการแจ้งเตือน</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-gray-50 text-center">
          <button className="text-sm text-[#2E7D32] font-medium hover:underline hover:text-green-700 transition-colors">
            ดูทั้งหมด
          </button>
        </div>
      </div>
    </>,
    document.body 
  );
};

export default NotificationBell;