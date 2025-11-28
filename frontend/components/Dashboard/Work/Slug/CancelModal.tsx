"use client";

import { X, Trash2 } from "lucide-react";

export default function CancelModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
          <h2 className="text-xl font-bold text-red-600 flex items-center gap-2">
            <Trash2 className="w-6 h-6" />
            ยืนยันการยกเลิกงาน
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <p className="text-gray-700 leading-relaxed mb-6">
          คุณแน่ใจหรือไม่ว่าต้องการลบงานนี้ออกจากระบบ?
          <br />
          การดำเนินการนี้ไม่สามารถย้อนกลับได้
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            ยกเลิก
          </button>

          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
          >
            ยืนยันลบงาน
          </button>
        </div>
      </div>
    </div>
  );
}
