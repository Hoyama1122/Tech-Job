"use client";

import { Save, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const EditModal = ({ data, onClose, onSave }) => {
  const modalRef = useRef(null);
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!data) return null;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 "
    >
      <div
        ref={modalRef}
        className="bg-white w-full max-w-2xl rounded-xl shadow-xl p-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-slate-800">
              แก้ไขข้อมูลพนักงาน
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              โปรดตรวจสอบข้อมูลก่อนกดบันทึก
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-500 transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                ชื่อ-นามสกุล
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                อีเมล
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                เบอร์โทร
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                แผนก
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ฝ่ายพัฒนา">ฝ่ายพัฒนา</option>
                <option value="ฝ่ายการตลาด">ฝ่ายการตลาด</option>
                <option value="ฝ่ายขาย">ฝ่ายขาย</option>
                <option value="ฝ่ายบุคคล">ฝ่ายบุคคล</option>
                <option value="ฝ่ายการเงิน">ฝ่ายการเงิน</option>
              </select>
            </div>

            {/* Team */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                ทีม
              </label>
              <input
                type="text"
                name="team"
                value={formData.team || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ไม่ระบุ"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                สถานะ
              </label>
              <select
                name="status"
                value={formData.status || "active"}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">ทำงาน</option>
                <option value="pending">รออนุมัติ</option>
                <option value="inactive">ออก</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium cursor-pointer text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2  flex items-center gap-1 cursor-pointer text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors"
            >
             <Save className="w-4 h-4"/> บันทึกข้อมูล
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;