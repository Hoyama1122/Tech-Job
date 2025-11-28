"use client";

import { Save, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const EditModal = ({ data, onClose, onSave }) => {
  const modalRef = useRef(null);
  const [formData, setFormData] = useState(data);

  // ปิดด้วย ESC
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // ปิดเมื่อกดข้างนอก modal
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
  };

  // อัปเดตข้อมูล input
  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // บันทึกข้อมูล
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!data) return null;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
    >
      <div
        ref={modalRef}
        className="bg-white w-full max-w-xl rounded-xl shadow-xl p-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-slate-800">
              แก้ไขข้อมูลพนักงาน
            </h2>
            <p className="text-sm text-slate-500">
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ชื่อ-นามสกุล */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              ชื่อ - นามสกุล
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInput}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          {/* อีเมล */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">อีเมล</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInput}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          {/* เบอร์โทร */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">เบอร์โทร</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInput}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* แผนก */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">แผนก</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleInput}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="ไฟฟ้า">ไฟฟ้า</option>
              <option value="แอร์">แอร์</option>
              <option value="ประปา">ประปา</option>
              <option value="สื่อสาร">สื่อสาร</option>
              <option value="ทั่วไป">ทั่วไป</option>
            </select>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium bg-slate-100 hover:bg-slate-200 rounded-lg"
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              className="px-5 py-2 flex items-center gap-1 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg"
            >
              <Save className="w-4 h-4" /> บันทึกข้อมูล
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditModal;
