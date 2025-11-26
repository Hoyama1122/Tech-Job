"use client";
import React, { useState } from "react";

import profile from "@/public/profile/profile.png";
import Image from "next/image";
import NotifacationBell from "../Layout/NotifacationBell";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

const RightNavbar = ({ Noti }: { Noti: any[] }) => {

  const router = useRouter();
  
  const goToProfile = () => {
    router.push("/technician/Profile");
  }

  const [showNotificationsBell, setShowNotificationsBell] = useState(false);
  return (
    <div className="flex items-center gap-3 px-4 ">
      
      <div className="relative">
        <button
          className="btn-noti group cursor-pointer"
          onClick={() => setShowNotificationsBell(!showNotificationsBell)}
        >
         <FontAwesomeIcon icon={faBell} size='lg'/>
          {Noti.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {Noti.length}
            </span>
          )}
        </button>
        {/* Notification Dropdown */}
        {showNotificationsBell && (
          <NotifacationBell
            setShowNotificationsBell={setShowNotificationsBell}
            Noti={Noti}
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
          onClick={goToProfile}
        />
        
      </div>
    </div>
  );
};

export default RightNavbar;
