"use client";

import React, { useEffect, useState } from "react";
import { NavNotifacation } from "@/lib/Mock/NavNotifacation";
import profile from "@/public/profile/profile.png";
import Image from "next/image";
import NotifacationBell from "../Layout/NotifacationBell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

type User = {
  role?: string;
  profile?: {
    firstname?: string | null;
    lastname?: string | null;
    avatar?: string | null;
  } | null;
};

type RightNavbarProps = {
  user?: User | null;
};

const RightNavbar = ({ user }: RightNavbarProps) => {
  const [showNotificationsBell, setShowNotificationsBell] = useState(false);

  const fullName =
    `${user?.profile?.firstname || ""} ${
      user?.profile?.lastname || ""
    }`.trim() || "ผู้ใช้งาน";

  const router = useRouter();
  const goprolfile = async () => {
    await router.push(`/${user?.role?.toLocaleLowerCase()}/profile`);
  };
  return (
    <div className="flex items-center gap-2 px-2 sm:gap-3 sm:px-4">
      <div className="relative shrink-0">
        <button
          type="button"
          className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition hover:bg-black/5 sm:h-10 sm:w-10"
          onClick={() => setShowNotificationsBell((prev) => !prev)}
        >
          <FontAwesomeIcon icon={faBell} className="text-sm sm:text-base" />

          {NavNotifacation.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white sm:h-5 sm:min-w-5 sm:text-xs">
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

      <div className="hidden h-8 w-px bg-gray-200 sm:block" />

      <div
        className="flex min-w-0 items-center gap-2 sm:gap-3 cursor-pointer"
        onClick={goprolfile}
      >
        <Image
          src={profile}
          alt="profile"
          width={40}
          height={40}
          className="h-9 w-9 shrink-0 rounded-full object-cover sm:h-10 sm:w-10"
        />

        <div className="min-w-0 leading-tight ">
          <p className="truncate text-[11px] font-semibold text-primary sm:text-[12px] md:text-[13px]">
            {fullName}
          </p>
          <h1 className="truncate text-[10px] font-medium text-gray-500 sm:text-[11px] md:text-[12px]">
            {user?.role || "-"}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default RightNavbar;
