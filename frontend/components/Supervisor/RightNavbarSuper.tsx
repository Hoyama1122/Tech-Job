import React, { useState } from "react";
import { Bell, Mail, Search } from "lucide-react";
import {
  NavNotifacation,
} from "@/lib/Mock/NavNotifacation";
import profile from "@/public/profile/profile.jpg";
import Image from "next/image";
import NotifacationBell from "../Dashboard/NotifacationBell";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
const RightNavbar = () => {
  const [showNotificationsBell, setShowNotificationsBell] = useState(false);
  const [showNotificationsMail, setShowNotificationsMail] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  return (
    <div className="flex items-center gap-3 px-4 ">
      
      <div className="relative">
        <button
          className="btn-noti group cursor-pointer"
          onClick={() => setShowNotificationsBell(!showNotificationsBell)}
        >
         <FontAwesomeIcon icon={faBell} size='lg'/>
          {NavNotifacation.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {NavNotifacation.length}
            </span>
          )}
        </button>
        {/* Notification Dropdown */}
        {showNotificationsBell && (
          <NotifacationBell
            setShowNotificationsBell={setShowNotificationsBell}
            NavNotifacation={NavNotifacation}
          />
        )}
      </div>
      {/*  */}
      <div className="w-px h-8 bg-gray-200" />
      <div className="flex items-center gap-2">
        <Image
          src={profile}
          alt="profile"
          className="w-10 h-10 rounded-full bg-cover bg-no-repeat"
        />
        <div className=" leading-4">
          <h1 className="text-md text-primary-test font-semibold">
            Supervisor
          </h1>
          <p className="text-sm">นายจัก ปูหอม</p>
        </div>
      </div>
    </div>
  );
};

export default RightNavbar;
