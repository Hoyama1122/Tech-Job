"use client";

import React from "react";
import Image from "next/image";
import profileFallback from "@/public/profile/profile.png";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  BadgeInfo,
  Users,
  Building2,
} from "lucide-react";

type ProfileUser = {
  id: number;
  empno?: string | null;
  email?: string | null;
  role?: string | null;
  department?: {
    id: number;
    name: string;
  } | null;
  profile?: {
    firstname?: string | null;
    lastname?: string | null;
    phone?: string | null;
    avatar?: string | null;
    gender?: string | null;
    birthday?: string | null;
    address?: string | null;
  } | null;
};

type ProfileCardProps = {
  user: ProfileUser;
  title?: string;
  subtitle?: string;
};

const roleLabelMap: Record<string, string> = {
  ADMIN: "ผู้ดูแลระบบ",
  SUPERVISOR: "หัวหน้างาน",
  TECHNICIAN: "ช่างเทคนิค",
  EXECUTIVE: "ผู้บริหาร",
  SUPERADMIN: "ผู้ดูแลระบบสูงสุด",
};

const genderLabelMap: Record<string, string> = {
  male: "ชาย",
  female: "หญิง",
  other: "อื่น ๆ",
};

export default function ProfileCard({
  user,
  title = "ข้อมูลโปรไฟล์",
  subtitle = "ข้อมูลส่วนตัวและรายละเอียดการติดต่อ",
}: ProfileCardProps) {
  const fullName =
    `${user?.profile?.firstname || ""} ${user?.profile?.lastname || ""}`.trim() ||
    "ไม่ระบุชื่อ";

  const firstChar =
    user?.profile?.firstname?.charAt(0) ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

  const roleLabel = user?.role
    ? roleLabelMap[user.role] || user.role
    : "-";

  const genderText = user?.profile?.gender
    ? genderLabelMap[user.profile.gender] || user.profile.gender
    : "-";

  const birthdayText = user?.profile?.birthday
    ? new Date(user.profile.birthday).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

  const avatarSrc = user?.profile?.avatar || profileFallback;

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary md:text-4xl">{title}</h1>
        <p className="mt-1 font-medium text-gray-500">{subtitle}</p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-6 text-center md:px-6 md:py-8">
          <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-primary shadow-md">
            {user?.profile?.avatar ? (
              <Image
                src={avatarSrc}
                alt={fullName}
                width={112}
                height={112}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-4xl font-bold text-white">{firstChar}</span>
            )}
          </div>

          <h2 className="mt-4 text-2xl font-bold text-slate-900">{fullName}</h2>
          <p className="mt-1 text-sm font-medium tracking-wide text-primary">
            {roleLabel}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 md:p-8">
          <InfoCard icon={<BadgeInfo className="h-5 w-5" />} label="รหัสพนักงาน">
            {user?.empno || "-"}
          </InfoCard>

          <InfoCard icon={<Building2 className="h-5 w-5" />} label="แผนก">
            {user?.department?.name || "-"}
          </InfoCard>

          <InfoCard icon={<Mail className="h-5 w-5" />} label="อีเมล">
            <span className="break-all">{user?.email || "-"}</span>
          </InfoCard>

          <InfoCard icon={<Phone className="h-5 w-5" />} label="เบอร์โทร">
            {user?.profile?.phone || "-"}
          </InfoCard>

          <InfoCard icon={<Users className="h-5 w-5" />} label="เพศ">
            {genderText}
          </InfoCard>

          <InfoCard icon={<Calendar className="h-5 w-5" />} label="วันเกิด">
            {birthdayText}
          </InfoCard>

          <InfoCard icon={<MapPin className="h-5 w-5" />} label="ที่อยู่" full>
            {user?.profile?.address || "-"}
          </InfoCard>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  children,
  full = false,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-slate-50 p-4 ${
        full ? "md:col-span-2" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {label}
          </p>
          <div className="mt-1 text-sm font-medium text-slate-900 md:text-base">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}