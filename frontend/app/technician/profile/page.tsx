"use client";

import React, { useEffect, useState } from "react";
import ProfileCard from "@/components/ProfileCard";
import ProfileEditForm from "@/components/ProfileEditForm";
import { profileService } from "@/services/profile.service";
import { X } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openEditModal, setOpenEditModal] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await profileService.getMyProfile();
      setUser(res.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">กำลังโหลด...</div>;
  }

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-500">ไม่พบข้อมูลผู้ใช้งาน</div>
    );
  }

  return (
    <>
      <div className="space-y-6 p-4 md:p-6">
        <ProfileCard user={user} onEdit={() => setOpenEditModal(true)} />
      </div>

      {openEditModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
          onClick={() => setOpenEditModal(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpenEditModal(false)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow transition hover:bg-white"
            >
              <X className="h-5 w-5" />
            </button>

            <ProfileEditForm
              user={user}
              onUpdated={() => {
                setOpenEditModal(false);
                fetchProfile();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}