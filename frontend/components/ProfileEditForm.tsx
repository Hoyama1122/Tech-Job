"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import profileFallback from "@/public/profile/profile.png";
import { Camera, Loader2, MapPin, Phone } from "lucide-react";
import { profileService } from "@/services/profile.service";
import { toast } from "react-toastify";

type ProfileEditFormProps = {
  user: {
    profile?: {
      avatar?: string | null;
      phone?: string | null;
      address?: string | null;
    } | null;
  };
  onUpdated?: (data: any) => void;
};

export default function ProfileEditForm({
  user,
  onUpdated,
}: ProfileEditFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    avatar: user?.profile?.avatar || "",
    phone: user?.profile?.phone || "",
    address: user?.profile?.address || "",
  });

  const [preview, setPreview] = useState(user?.profile?.avatar || "");
  const [saving, setSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChooseImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      // ตรงนี้ถ้ายังไม่มี upload จริง
      // ให้เปลี่ยนเป็น service upload ของคุณภายหลัง
      // ตัวอย่าง: const res = await uploadService.uploadImage(file);
      // setFormData((prev) => ({ ...prev, avatar: res.url }));

      // mock ชั่วคราว
      setFormData((prev) => ({
        ...prev,
        avatar: localPreview,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        avatar: formData.avatar || undefined,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
      };

      const res = await profileService.updateMyProfile(payload);

      onUpdated?.(res.data);
      toast.success("อัปเดตโปรไฟล์สำเร็จ");
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || "อัปเดตโปรไฟล์ไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] md:p-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">แก้ไขโปรไฟล์</h2>
        <p className="mt-1 text-sm text-slate-500">
          แก้ไขรูปโปรไฟล์ เบอร์โทร และที่อยู่
        </p>
      </div>

      <div className="mb-8 flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-slate-100 shadow">
            <Image
              src={preview || profileFallback}
              alt="avatar preview"
              width={128}
              height={128}
              className="h-full w-full object-cover"
            />
          </div>

          <button
            type="button"
            onClick={handleChooseImage}
            className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow transition hover:scale-105"
          >
            <Camera className="h-5 w-5" />
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="text-center">
          <button
            type="button"
            onClick={handleChooseImage}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            เปลี่ยนรูปโปรไฟล์
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Phone className="h-4 w-4" />
            เบอร์โทร
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="กรอกเบอร์โทร"
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <MapPin className="h-4 w-4" />
            ที่อยู่
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="กรอกที่อยู่"
            rows={4}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-primary"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
        </button>
      </div>
    </form>
  );
}