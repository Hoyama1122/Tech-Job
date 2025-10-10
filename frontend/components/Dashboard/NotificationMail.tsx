
import { NavNotifacationMail } from "@/lib/Mock/NavNotifacation";
import React from "react";
type NavNotifacation = {
  NavNotifacationMail: {
    id: number;
    user: string;
    department: string;
    message: string;  
    time: string;
    unread: boolean;
  }[];
  setShowNotificationsMail: React.Dispatch<React.SetStateAction<boolean>>;
};
const NotifacationMail = ({
  setShowNotificationsMail,
  NavNotifacationMail,
}: NavNotifacation) => {
  return (
    <>
      <div
        className="fixed inset-0 "
        onClick={() => setShowNotificationsMail(false)}
      />
      <div className="absolute right-1 mt-2 w-[200px] md:w-[450px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
        <div className="px-4 py-3">
          <h3 className="font-semibold text-xl">การแจ้งเตือน</h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {NavNotifacationMail.map((notif) => (
            <div
              key={notif.id}
              className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors ${
                notif.unread ? "bg-blue-50" : ""
              }`}
            >
              <p className="font-medium">{notif.user}</p>
              <p className="text-sm text-gray-800 font-medium">
                {notif.message}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {notif.time} {notif.unread === true && <span>อ่านแล้ว</span>}
              </p>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 bg-gray-50 text-center">
          <button className="text-sm text-[#2E7D32] font-medium hover:underline">
            ดูทั้งหมด
          </button>
        </div>
      </div>
    </>
  );
};

export default NotifacationMail;
