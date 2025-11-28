import React, { useEffect, useState } from "react";
import { Bell, Mail, Search } from "lucide-react";
import { NavNotifacation } from "@/lib/Mock/NavNotifacation";
import profile from "@/public/profile/profile.png";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
const RightNavbar = () => {
  const [user, setuser] = useState([]);

  useEffect(() => {
    const GetUser = localStorage.getItem("auth-storage");
    if (GetUser) {
      setuser(JSON.parse(GetUser));
    } else {
      toast.error("ไม่พบข้อมูลผู้ใช้");
    }
  }, [setuser]);
  return (
    <div className="flex items-center gap-3 px-4 ">
      <div className="relative"></div>
      {/*  */}
      <div className="w-px h-8 bg-gray-200" />
      <div className="flex items-center gap-2">
        <Image
          src={profile}
          alt="profile"
          className="w-10 h-10 rounded-full bg-cover bg-no-repeat"
        />
        <div className=" leading-4">
          <h1 className="text-base text-primary-test">
            {user.state?.name}
          </h1>
          <p className="text-sm  font-semibold">Supervisor</p>
        </div>
      </div>
    </div>
  );
};

export default RightNavbar;
