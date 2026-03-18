"use client";

import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

const roleLabelMap: Record<string, string> = {
  SUPERADMIN: "ผู้ดูแลสูงสุด",
  ADMIN: "ธุรการ",
  SUPERVISOR: "หัวหน้างาน",
  TECHNICIAN: "ช่างเทคนิค",
};

export const useCurrentUser = (autoFetch = false) => {
  const me = useAuthStore((state) => state.me);
  const loading = useAuthStore((state) => state.loading);
  const fetchMe = useAuthStore((state) => state.fetchMe);

  useEffect(() => {
    if (autoFetch && !me) {
      fetchMe();
    }
  }, [autoFetch, me, fetchMe]);

  const fullName =
    `${me?.profile?.firstname || ""} ${me?.profile?.lastname || ""}`.trim() ||
    me?.email ||
    "ไม่พบข้อมูลผู้ใช้";

  const roleLabel = me?.role ? roleLabelMap[me.role] || me.role : "-";

  return {
    me,
    loading,
    fullName,
    roleLabel,
  };
};
