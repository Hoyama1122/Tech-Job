"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  X,
  FileText,
  ImageIcon,
  Upload,
  Check,
  XCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";

import DropdownTechnician from "../../Form/DropdownTechnician";
import { jobService } from "@/services/job.service";
import { userService } from "@/services/user.service";
import { toast } from "react-toastify";


interface Technician {
  id: number;
  name: string;
  department: string;
}

interface Job {
  id?: number | string;
  JobId: string;
  title: string;
  description: string;
  technician: Technician[];
  technicians?: Technician[];
  images?: any[];
  imageKey?: string;
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<{ url: string; file?: File }[]>([]);
  // Images logic for EditJob has limitation: Backend replaces all images if new are sent.
  // We'll focus on text fields and technicians for this core update functionality.
  useEffect(() => {
    if (job.images && Array.isArray(job.images)) {
      setImages(job.images.map((img: any) => ({ url: img.url })));
    }
  }, [job]);

  const [availableTechnicians, setAvailableTechnicians] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const methods = useForm({
    defaultValues: {
      title: job.title,
      description: job.description || "",
      technicianId: job.technicians?.map((t: any) => t.id) || job.technician?.map((t: any) => t.id) || [],
    },
  });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    const fetchTechs = async () => {
      try {
        const res = await userService.getUsers();
        const users = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : [];
        const techs = users.filter((u: any) => u.role?.toUpperCase() === "TECHNICIAN");
        setAvailableTechnicians(techs);
      } catch (err) {
        console.error("Failed to load technicians", err);
      }
    };
    fetchTechs();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newItems = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newItems]);
  };

  const removeImage = (index: number) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  const onSubmit = async (data: any) => {
    setIsSaving(true);

    try {
      const newFiles = images.filter((img) => img.file).map((img) => img.file!);

      const payload = {
        title: data.title,
        description: data.description,
        technicianId: data.technicianId,
        images: newFiles.length > 0 ? newFiles : undefined,
      };

      const updatedJobRes = await jobService.updateJob(job.id || job.JobId, payload as any);

      toast.success("แก้ไขรายละเอียดใบงานสำเร็จ");
      // Give time for UI
      await new Promise((res) => setTimeout(res, 500));

      onSave(updatedJobRes.job || updatedJobRes);
      onClose();
    } catch (err) {
      console.error("Error saving job:", err);
      toast.error("เกิดข้อผิดพลาดในการแก้ไขใบงาน");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* HEADER */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              แก้ไขรายละเอียดใบงาน
            </h2>

            <button
              onClick={onClose}
              type="button"
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* TITLE */}
            <div>
              <label className="text-sm font-semibold flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-blue-600" />
                หัวข้อใบงาน
              </label>

              <input
                type="text"
                {...methods.register("title", {
                  required: "กรุณากรอกหัวข้อใบงาน",
                })}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 placeholder-gray-400"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                รายละเอียดงาน
              </label>

              <textarea
                {...methods.register("description", {
                  required: "กรุณากรอกรายละเอียดงาน",
                })}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 placeholder-gray-400 resize-none"
                rows={4}
              />

              {errors.description && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {String(errors.description.message)}
                </p>
              )}
            </div>

            {/* TECHNICIANS */}
            <DropdownTechnician technicians={availableTechnicians} />

            {/* IMAGES */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                รูปภาพหลักฐาน ({images.length} รูป)
              </label>

              <div className="flex gap-3 flex-wrap">
                {images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={img.url}
                      className="w-24 h-24 object-cover rounded-lg shadow-sm"
                    />
                    <button
                      onClick={() => removeImage(i)}
                      type="button"
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center bg-primary text-white px-4 py-1 rounded-lg"
              >
                <Upload className="w-6 h-6 mb-1" />
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <span className="text-sm ml-2">เพิ่มรูปภาพ</span>
              </button>
            </div>
          </div>

          {/* FOOTER */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 py-2 rounded-lg"
            >
              <XCircle className="w-4 h-4 inline-block mr-1" />
              ยกเลิก
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-primary text-white py-2 rounded-lg disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" />
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 inline-block mr-1" />
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
