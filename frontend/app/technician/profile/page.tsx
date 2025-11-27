"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  IdCard,
  BadgeInfo,
  Loader2,
  Users,
  Building2,
  Calendar1,
} from "lucide-react";

export default function TechnicianProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const authRaw = localStorage.getItem("auth-storage");
      const usersRaw = localStorage.getItem("Users");

      if (!authRaw || !usersRaw) return;

      const auth = JSON.parse(authRaw);
      const users = JSON.parse(usersRaw);

      const technicianId = auth?.state?.userId;

      const me = users.find((u: any) => u.id === technicianId);

      setUser(me || null);
    } catch (e) {
      console.error("Error loading user:", e);
    }

    setTimeout(() => setLoading(false), 200);
  }, []);

  if (loading) return <ProfileSkeleton />;

  if (!user)
    return (
      <div className="p-6 text-center text-gray-600">ไม่พบข้อมูลผู้ใช้งาน</div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-primary ">
          ข้อมูลโปรไฟล์ช่าง
        </h1>
        <p className="text-gray-500 mt-1 font-medium">
          ข้อมูลส่วนตัวและรายละเอียดการติดต่อ
        </p>
      </div>
      {/* Profile card */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/60 overflow-hidden">
        <div className="relative bg-white/60 px-4 py-4 text-center border-b border-gray-200">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
          <div className="relative mx-auto w-28 h-28 rounded-full bg-primary/80  border-4  flex items-center justify-center shadow-lg backdrop-blur-sm border-primary/90">
            <span className="text-4xl font-bold text-white">
              {user.name?.charAt(0)}
            </span>
          </div>
          <h2 className="relative mt-4 text-2xl font-bold text-primery">
            {user.name}
          </h2>
          <p className="relative text-primary text-sm font-medium tracking-wide">
            {user.role === "technician"
              ? "ช่างเทคนิค"
              : user.role === "admin"
              ? "ผู้ดูแลระบบ"
              : "ผู้ดูแลระบบ"}
          </p>
        </div>
        {/* Detail Section */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Employee Code */}
          <div className="group p-4 rounded-2xl bg-gray-100  backdrop-blur-sm border border-gray-200/50 ">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <BadgeInfo className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-semibold tracking-wide uppercase">
                  รหัสพนักงาน
                </p>
                <p className="text-sm md:text-base font-medium text-gray-900 mt-1">
                  {user.employeeCode || "-"}
                </p>
              </div>
            </div>
          </div>
          {/* Department */}
          <div className="group p-4 rounded-2xl bg-gray-100  backdrop-blur-sm border border-gray-200/50 ">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-semibold tracking-wide uppercase">
                  แผนก
                </p>
                <p className="text-sm md:text-base font-medium text-gray-900 mt-1">
                  {user.department || "-"}
                </p>
              </div>
            </div>
          </div>
          {/* Email */}
          <div className="group p-4 rounded-2xl bg-gray-100  backdrop-blur-sm border border-gray-200/50 ">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-semibold tracking-wide uppercase">
                  อีเมล
                </p>
                <p className="text-sm md:text-base font-medium text-gray-900 mt-1">
                  {user.email || "-"}
                </p>
              </div>
            </div>
          </div>
          {/* Phone */}
          <div className="group p-4 rounded-2xl bg-gray-100  backdrop-blur-sm border border-gray-200/50 ">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-semibold tracking-wide uppercase">
                  เบอร์โทร
                </p>
                <p className="text-sm md:text-base font-medium text-gray-900 mt-1">
                  {user.phone || "-"}
                </p>
              </div>
            </div>
          </div>
          {/* Gender */}
          <div className="group p-4 rounded-2xl bg-gray-100  backdrop-blur-sm border border-gray-200/50 ">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-semibold tracking-wide uppercase">
                  เพศ
                </p>
                <p className="text-sm md:text-base font-medium text-gray-900 mt-1">
                  {user.gender === "male"
                    ? "ชาย"
                    : user.gender === "female"
                    ? "หญิง"
                    : "อื่น ๆ"}
                </p>
              </div>
            </div>
          </div>
          {/* Birthday */}
          <div className="group p-4 rounded-2xl bg-gray-100  backdrop-blur-sm border border-gray-200/50 ">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-semibold tracking-wide uppercase">
                  วันเกิด
                </p>
                <p className="text-sm md:text-base font-medium text-gray-900 mt-1">
                  {user.birthday || "-"}
                </p>
              </div>
            </div>
          </div>
          {/* ID Card */}
          <div className="group p-4 rounded-2xl bg-gray-100  backdrop-blur-sm border border-gray-200/50 ">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <IdCard className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-semibold tracking-wide uppercase">
                  เลขบัตรประชาชน
                </p>
                <p className="text-sm md:text-base font-medium text-gray-900 mt-1">
                  {user.citizenId || "-"}
                </p>
              </div>
            </div>
          </div>
          {/* Address */}
          <div className="group p-4 rounded-2xl bg-gray-100  backdrop-blur-sm border border-gray-200/50 ">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-semibold tracking-wide uppercase">
                  ที่อยู่
                </p>
                <p className="text-sm md:text-base font-medium text-gray-900 mt-1">
                  {user.address || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-4 w-56 bg-gray-200 rounded-lg animate-pulse mt-2" />
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/60 overflow-hidden">
          <div className="px-6 py-10 bg-gray-200 animate-pulse" />
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="p-4 rounded-2xl ">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse" />
                  <div className="flex-1">
                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mt-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
