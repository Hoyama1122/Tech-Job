"use client";

import { useState, useEffect } from "react";
import { X, Users, Image as ImageIcon, FileText, Plus, Trash2, Upload, User } from "lucide-react";
import DropdownTechnician from "../../Form/DropdownTechnician";

interface Technician {
  id: number;
  name: string;
  department: string;
}

interface Job {
  JobId: string;
  description: string;
  technician: Technician[];
  image?: any;
}

interface EditWorkModalProps {
  job: Job;
  onClose: () => void;
  onSave: (updatedJob: Job) => void;
}

export default function EditWorkModal({ job, onClose, onSave }: EditWorkModalProps) {
  const [description, setDescription] = useState(job.description || "");
  const [technicians, setTechnicians] = useState<Technician[]>(job.technician || []);
  const [availableTechnicians, setAvailableTechnicians] = useState<Technician[]>([]);
  const [showTechDropdown, setShowTechDropdown] = useState(false);
  const [images, setImages] = useState<string[]>(
    Array.isArray(job.image) ? job.image : job.image ? [job.image] : []
  );
  const [isSaving, setIsSaving] = useState(false);

  // Load available technicians from localStorage
  useEffect(() => {
    const usersData = localStorage.getItem("Users");
    if (usersData) {
      const users = JSON.parse(usersData);
      const techs = users.filter((u: any) => u.role === "technician");
      // Filter out already assigned technicians
      const filteredTechs = techs.filter(
        (tech: Technician) => !technicians.some(t => t.id === tech.id)
      );
      setAvailableTechnicians(filteredTechs);
    }
  }, [technicians]);

  const handleSave = async () => {
    setIsSaving(true);
    const updatedJob = {
      ...job,
      description,
      technician: technicians,
      image: images,
    };

    const cardData = JSON.parse(localStorage.getItem("CardWork") || "[]");
    const updated = cardData.map((j: any) =>
      j.JobId === job.JobId ? updatedJob : j
    );
    localStorage.setItem("CardWork", JSON.stringify(updated));

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onSave(updatedJob);
    setIsSaving(false);
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeTechnician = (techId: number) => {
    setTechnicians(prev => prev.filter(t => t.id !== techId));
  };

  const addTechnician = (tech: Technician) => {
    setTechnicians(prev => [...prev, tech]);
    setAvailableTechnicians(prev => prev.filter(t => t.id !== tech.id));
    setShowTechDropdown(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            แก้ไขรายละเอียดใบงาน
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Description Section */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FileText className="w-4 h-4 text-blue-600" />
              รายละเอียดงาน
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="กรอกรายละเอียดงาน..."
            />
          </div>

          {/* Technicians Section */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Users className="w-4 h-4 text-blue-600" />
              ช่างที่รับผิดชอบ ({technicians.length} คน)
            </label>
            
            <div className="space-y-2">
              {technicians.map((tech) => (
                <div
                  key={tech.id}
                  className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-3 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 text-white flex items-center justify-center text-sm">
                      {tech.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{tech.name}</p>
                      <p className="text-xs text-gray-500">{tech.department}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeTechnician(tech.id)}
                    className="p-1.5 rounded-full hover:bg-red-100 text-red-500 transition-colors"
                    aria-label={`ลบ ${tech.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Technician Dropdown */}
            <div className="relative">
              <DropdownTechnician
              
              />
            </div>

            {availableTechnicians.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">ไม่มีช่างว่างเพิ่มเติม</p>
            )}
          </div>

          {/* Images Section */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              รูปภาพหลักฐาน ({images.length} รูป)
            </label>

            <div className="flex gap-3 flex-wrap">
              {images.map((img, i) => (
                <div key={i} className="relative group">
                  <img
                    src={img}
                    alt={`รูปภาพ ${i + 1}`}
                    className="w-24 h-24 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    aria-label={`ลบรูปภาพ ${i + 1}`}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
              <div className="flex flex-col items-center">
                <Upload className="w-6 h-6 text-gray-400 mb-1" />
                <p className="text-sm font-medium text-gray-600">อัพโหลดรูปภาพเพิ่มเติม</p>
                <p className="text-xs text-gray-500">รองรับหลายไฟล์พร้อมกัน</p>
              </div>
            </label>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                กำลังบันทึก...
              </>
            ) : (
              "บันทึกการแก้ไข"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}