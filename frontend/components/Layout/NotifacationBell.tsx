"use client";
import { createPortal } from "react-dom";
import { BellDot, X } from "lucide-react";

const NotificationBell = ({ Noti, setShowNotificationsBell }) => {
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const markAsRead = (notifId: number) => {
    const users = JSON.parse(localStorage.getItem("Users") || "[]");
    const auth = JSON.parse(localStorage.getItem("auth-storage") || "{}");
    const techId = auth?.state?.userId;

    if (!techId) return;

    const idx = users.findIndex((u: any) => u.id === techId);
    if (idx === -1) return;

    users[idx].notifications = users[idx].notifications.map((n: any) =>
      n.id === notifId ? { ...n, read: true } : n
    );

    localStorage.setItem("Users", JSON.stringify(users));

    console.log(notifId);

    setShowNotificationsBell(false);
  };

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[9999] bg-black/30 backdrop-blur-sm"
        onClick={() => setShowNotificationsBell(false)}
      />

      <div
        className="fixed top-16 right-4 z-[10000] w-[380px] max-w-[90vw] md:max-w-[450px] 
        bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
        onClick={handleDropdownClick}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold text-xl text-gray-800 flex items-center gap-2">
            <BellDot className="w-6 h-6 text-primary" />
            การแจ้งเตือน
          </h3>
          <button
            onClick={() => setShowNotificationsBell(false)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Notification List */}
        <div className="max-h-96 overflow-y-auto">
          {Noti.length > 0 ? (
            Noti.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ransition-colors ${
                  notif.read === false ? "" : ""
                }`}
              >
                <p className="text-sm text-gray-800 font-medium">
                  {notif.message}
                </p>

                <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                  <span>
                    {new Date(notif.createdAt).toLocaleString("th-TH")}
                  </span>

                  {notif.read && (
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
      </div>
    </>,
    document.body
  );
};

export default NotificationBell;
