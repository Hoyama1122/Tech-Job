"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, LogOut, AlertCircle } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal = ({ isOpen, onClose, onConfirm }: LogoutModalProps) => {

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

 
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Container */}
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out scale-100"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-labelledby="logout-title"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-yellow-500" />
              <h3 id="logout-title" className="text-xl font-bold text-gray-800">
                ยืนยันการออกจากระบบ
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <p className="text-gray-600 text-center leading-relaxed">
              คุณต้องการออกจากระบบใช่หรือไม่?
            </p>
            
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 flex gap-3 justify-end rounded-b-2xl">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 cursor-pointer hover:bg-red-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <LogOut size={18} />
              ออกจากระบบ
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default LogoutModal;