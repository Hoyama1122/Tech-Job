"use client";

import React, { useState } from "react";
import { NavNotifacation } from "@/lib/Mock/NavNotifacation";
import profile from "@/public/profile/profile.png";
import Image from "next/image";
import NotifacationBell from "../Layout/NotifacationBell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const RightNavbar = () => {
  const [showNotificationsBell, setShowNotificationsBell] = useState(false);

  const { fullName, roleLabel, loading } = useCurrentUser();
  
  return (
    <div className="flex items-center gap-3 px-4">
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

        {showNotificationsBell && (
          <NotifacationBell
            setShowNotificationsBell={setShowNotificationsBell}
            NavNotifacation={NavNotifacation}
          />
        )}
      </div>

      <div className="w-px h-8 bg-gray-200" />

      <div className="flex items-center gap-2">
        <Image
          src={profile}
          alt="profile"
          className="w-10 h-10 rounded-full bg-cover bg-no-repeat"
        />

        <div className="leading-4">
          <p className="text-sm text-primary-test font-semibold">
            {loading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              fullName
            )}
          </p>
          <h1 className="text-md font-semibold">{roleLabel}</h1>
        </div>
      </div>
    </div>
  );
};

export default RightNavbar;
