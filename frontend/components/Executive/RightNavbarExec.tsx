"use client";
import React, { useEffect, useState } from "react";
import { NavNotifacation } from "@/lib/Mock/NavNotifacation";
import profile from "@/public/profile/profile.png";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "@/store/useAuthStore";
import NotificationBell from "../Layout/NotifacationBell";

const RightNavbarExec = () => {
  const [showNotificationsBell, setShowNotificationsBell] = useState(false);
  const { name, role } = useAuthStore();

  return (
    <div className="flex items-center gap-3 px-4 ">
      <div className="relative">
        <button
          className="btn-noti group cursor-pointer"
          onClick={() => setShowNotificationsBell(!showNotificationsBell)}
        >
          <FontAwesomeIcon icon={faBell} size="lg" />
          {NavNotifacation.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {NavNotifacation.length}
            </span>
          )}
        </button>
        {showNotificationsBell && <NotificationBell />}
      </div>
      <div className="w-px h-8 bg-gray-200" />
      <div className="flex items-center gap-2">
        <Image
          src={profile}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="leading-4">
          <p className="text-sm text-primary-test font-semibold">
            {name || "Executive"}
          </p>
          <h1 className="text-md capitalize">{role}</h1>
        </div>
      </div>
    </div>
  );
};

export default RightNavbarExec;
