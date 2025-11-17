"use client";

import React, { useState } from "react";
import { X, UserCheck } from "lucide-react";
import { CardWorkTypes } from "@/lib/Mock/CardWork";
import { Users } from "@/lib/Mock/UserMock";

type User = typeof Users[0];
type Job = CardWorkTypes;

interface Props {
  job: Job;
  technicians: User[];
  onClose: () => void;
  onAssign: (jobId: string, technicianIds: number[]) => void;
}

const AssignTechnicianModal = ({ job, technicians, onClose, onAssign }: Props) => {
  const [selectedTechIds, setSelectedTechIds] = useState<number[]>([]);

  // ฟังก์ชันสำหรับเลือก/ไม่เลือก ช่าง
  const handleSelectTechnician = (id: number) => {
    setSelectedTechIds((prev) =>
      prev.includes(id) ? prev.filter((techId) => techId !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    onAssign(job.JobId, selectedTechIds);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 animate-scaleIn"
        onClick={(e) => e.stopPropagation()} // ป้องกันการปิด Modal เมื่อคลิกด้านใน
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold text-primary">
            มอบหมายงาน: {job.title}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Job Info */}
        <div className="mb-4">
          <p className="text-sm text-gray-600"><strong>รหัสงาน:</strong> {job.JobId}</p>
          <p className="text-sm text-gray-600"><strong>รายละเอียด:</strong> {job.description || "-"}</p>
        </div>

        {/* Technician List */}
        <h3 className="font-semibold mb-2">เลือกช่างที่รับผิดชอบ (ในแผนกของคุณ)</h3>
        <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
          {technicians.length > 0 ? (
            technicians.map((tech) => (
              <label
                key={tech.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border-2 ${
                  selectedTechIds.includes(tech.id)
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedTechIds.includes(tech.id)}
                  onChange={() => handleSelectTechnician(tech.id)}
                  className="w-5 h-5 rounded text-primary focus:ring-primary"
                />
                <div>
                  <p className="font-semibold">{tech.name}</p>
                  <p className="text-sm text-gray-500">{tech.phone}</p>
                </div>
              </label>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">ไม่พบช่างในแผนกของคุณ</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            disabled={selectedTechIds.length === 0}
            className="button-create flex items-center gap-2 bg-primary hover:bg-primary-hover text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserCheck size={18} />
            ยืนยันการมอบหมาย
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignTechnicianModal;