"use client";
import React, { useState } from "react";
import { X, AlertTriangle } from "lucide-react";

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export default function RejectModal({ isOpen, onClose, onConfirm }: RejectModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return; // ป้องกันการส่งค่าว่าง
    onConfirm(reason);
    setReason(""); // ล้างค่าหลังจากส่ง
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden scale-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex justify-between items-center">
          <div className="flex items-center gap-2 text-red-700 font-bold text-lg">
            <AlertTriangle className="w-6 h-6" />
            ยืนยันการตีกลับงาน
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-red-100 rounded-full p-1 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-gray-600 text-sm">
            กรุณาระบุสาเหตุที่ต้องการตีกลับงานนี้ เพื่อให้ช่างเทคนิคทราบและดำเนินการแก้ไข
          </p>
          
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition resize-none"
            rows={4}
            placeholder="ระบุเหตุผล เช่น รูปภาพไม่ชัดเจน, งานยังไม่เรียบร้อย..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            autoFocus
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            disabled={!reason.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
          >
            ยืนยันตีกลับ
          </button>
        </div>
      </div>
    </div>
  );
}