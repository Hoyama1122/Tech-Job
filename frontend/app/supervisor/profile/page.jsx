"use client";

import React, { useEffect, useState } from "react";
import ProfileCard from "@/components/ProfileCard";
import { authService } from "@/services/auth.service";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await authService.me();
        setUser(res.user);
      } catch (error) {
        setUser(null);
      }
    };

    fetchMe();
  }, []);

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-500">ไม่พบข้อมูลผู้ใช้งาน</div>
    );
  }

  return <ProfileCard user={user} />;
}
