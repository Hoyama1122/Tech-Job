"use client";
import React, { useState } from "react";
import { Bell, Search, User, ChevronDown, Mail } from "lucide-react";
import { NavNotifacation, NavNotifacationMail } from "@/lib/Navlink/NavNotifacation";
const Navbar = () => {
  const [showNotificationsBell, setShowNotificationsBell] = useState(false);
  const [showNotificationsMail, setShowNotificationsMail] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="bg-[#F5F5F5] shadow-lg px-6 py-4 sticky top-0">
      <div className="flex items-center justify-between gap-4">
        {/* Title */}
        <div className="flex-1 max-w-xl">
          <h1 className="text-xl font-bold text-secondary hidden md:block">
            Dashboard
          </h1>
        </div>
        {/* Right Side */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button className="btn-mail group" onClick={() => setShowNotificationsBell(!showNotificationsBell)}>
              <Bell size={22} className='text-[#2E7D32] group-hover:text-[#F5F5F5]'  />
              {NavNotifacation.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {NavNotifacation.length}
                </span>
              )}
            </button>
            {/* Notification Dropdown */}
            {showNotificationsBell && (
              <>
                <div 
                  className='fixed inset-0 z-10' 
                  onClick={() => setShowNotificationsBell(false)}
                />
                <div className='absolute right-1 mt-2 w-[450px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-20'>
                  <div className='px-6 py-4 flex items-center gap-4'>
                    <Bell size={22} className='text-primary'  />
                    <h3 className='font-semibold text-xl'>การแจ้งเตือน</h3>
                  </div>
                  <div className='max-h-96 overflow-y-auto'>
                    {NavNotifacation.map((notif, index) => (
                      <div
                        key={notif.id}

                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors ${
                          notif.unread ? 'bg-blue-50' : ''
                        }`}
                      >
                        <p className='text-sm text-gray-800 font-medium'>{notif.message}</p>
                        <p className='text-xs text-gray-500 mt-1'>{notif.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className='px-4 py-2 bg-gray-50 text-center'>
                    <button className='text-sm text-[#2E7D32] font-medium hover:underline'>
                      ดูทั้งหมด
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          {/*  */}
          <div className='w-px h-8 bg-gray-200' />
          <div className="relative">
            <button className="btn-mail group" onClick={() => setShowNotificationsMail(!showNotificationsBell)}>
              <Mail size={22} className='text-[#2E7D32] group-hover:text-[#F5F5F5]'  />
              {NavNotifacation.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {NavNotifacation.length}
                </span>
              )}
            </button>
            {/* Notification Dropdown */}
            {showNotificationsMail && (
              <>
                <div 
                  className='fixed inset-0 z-10' 
                  onClick={() => setShowNotificationsMail(false)}
                />
                <div className='absolute right-1 mt-2 w-[450px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-20'>
                  <div className='px-4 py-3'>
                    <h3 className='font-semibold text-xl'>การแจ้งเตือน</h3>
                  </div>
                  <div className='max-h-96 overflow-y-auto'>
                    {NavNotifacationMail.map((notif) => (
                      <div
                        key={notif.id}
                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors ${
                          notif.unread ? 'bg-blue-50' : ''
                        }`}
                      >
                        <p className='font-medium'>{notif.user}</p>
                        <p className='text-sm text-gray-800 font-medium'>{notif.message}</p>
                        <p className='text-xs text-gray-500 mt-1'>{notif.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className='px-4 py-2 bg-gray-50 text-center'>
                    <button className='text-sm text-[#2E7D32] font-medium hover:underline'>
                      ดูทั้งหมด
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
