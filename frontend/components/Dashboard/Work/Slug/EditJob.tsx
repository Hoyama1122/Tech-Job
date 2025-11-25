"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  X,
  FileText,
  ImageIcon,
  Users,
  Plus,
  Upload,
  Trash2,
  Check,
  XCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import DropdownTechnician from "../../Form/DropdownTechnician";

interface Technician {
  id: number;
  name: string;
  department: string;
}

interface Job {
  JobId: string;
  title: string;
  description: string;
  technician: Technician[];
  image?: any;
}

interface EditWorkModalProps {
  job: Job;
  onClose: () => void;
  onSave: (updatedJob: Job) => void;
}

export default function EditWorkModal({
  job,
  onClose,
  onSave,
}: EditWorkModalProps) {
  const [images, setImages] = useState<string[]>(
    Array.isArray(job.image) ? job.image : job.image ? [job.image] : []
  );
  const [isSaving, setIsSaving] = useState(false);
  const [availableTechnicians, setAvailableTechnicians] = useState<
    Technician[]
  >([]);

  const methods = useForm({
    defaultValues: {
      title: job.title || "",
      description: job.description || "",
      technicianId: job.technician?.map((t) => t.id) || [],
      supervisorId: "",
    },
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    const usersData = localStorage.getItem("Users");
    if (usersData) {
      const users = JSON.parse(usersData);
      const techs = users.filter((u: any) => u.role === "technician");
      setAvailableTechnicians(techs);
    }
    setValue("description", job.description || "");
  }, [job, setValue]);

  const onSubmit = async (data: any) => {
    setIsSaving(true);

    const users = JSON.parse(localStorage.getItem("Users") || "[]");
    const selectedTechnicians = users.filter((u: any) =>
      data.technicianId?.map(Number).includes(u.id)
    );
    const updatedJob = {
      ...job,
      title: data.title,

      description: data.description,
      technician: selectedTechnicians,
      supervisorId: data.supervisorId,
      image: images,
    };

    // Save to localStorage
    const cardData = JSON.parse(localStorage.getItem("CardWork") || "[]");
    const updated = cardData.map((j: any) =>
      j.JobId === job.JobId ? updatedJob : j
    );
    localStorage.setItem("CardWork", JSON.stringify(updated));

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

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
        setImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Sticky Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              แก้ไขรายละเอียดใบงาน
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="ปิดหน้าต่าง"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FileText className="w-4 h-4 text-blue-600" />
                หัวข้อใบงาน
              </label>
              <input
                type="text"
                defaultValue={job.title}
                {...methods.register("title", {
                  required: "กรุณากรอกหัวข้อใบงาน",
                })}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FileText className="w-4 h-4 text-blue-600" />
                รายละเอียดงาน
              </label>
              <textarea
                {...methods.register("description", {
                  required: "กรุณากรอกรายละเอียดงาน",
                })}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                rows={4}
                placeholder="กรอกรายละเอียดงาน..."
              />
              {errors.description && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Technician Dropdown */}
            <DropdownTechnician technicians={availableTechnicians} />

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
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      aria-label={`ลบรูปภาพ ${i + 1}`}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex  items-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center bg-primary text-white px-4 py-1 rounded-lg hover:bg-primary-hover transition-colors"
                >
                  <Upload className="w-6 h-6 mb-2" />
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />

                  <span className="text-sm font-medium">เพิ่มรูปภาพ</span>
                </button>
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  บันทึกการแก้ไข
                </>
              )}
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
