"use client"
import React, { useState } from 'react';
import { Bell, Search, User, ChevronDown } from 'lucide-react';

const Navbar = () => {

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifications = [
    { id: 1, message: "งานใหม่: ซ่อมแอร์บ้านคุณสมชาย", time: "5 นาทีที่แล้ว", unread: true },
    { id: 2, message: "งานเสร็จสิ้น: เปลี่ยนท่อน้ำ", time: "1 ชั่วโมงที่แล้ว", unread: true },
    { id: 3, message: "ช่างยืนยันการรับงาน", time: "2 ชั่วโมงที่แล้ว", unread: false },
  ];

  return (
    <div className='bg-white shadow-md px-6 py-4 sticky top-0 z-20'>
      <div className='flex items-center justify-between gap-4'>
        
        {/* Search Bar */}
        <div className='flex-1 max-w-xl'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' size={20} />
            <input
              type="text"
              placeholder="ค้นหาใบงาน, ช่าง, ลูกค้า..."
              className='w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:bg-white transition-all duration-200'
            />
          </div>
        </div>

        {/* Right Side - Notification & Profile */}
        <div className='flex items-center gap-3'>
          
          {/* Notification Button */}
          <div className='relative'>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className='relative p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 group'
            >
              <Bell size={22} className='text-gray-600 group-hover:text-[#2E7D32]' />
              {notifications.length > 0 && (
                <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse'>
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <>
                <div 
                  className='fixed inset-0 z-10' 
                  onClick={() => setShowNotifications(false)}
                />
                <div className='absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-20'>
                  <div className='bg-gradient-to-r from-[#2E7D32] to-[#388E3C] px-4 py-3'>
                    <h3 className='text-white font-semibold'>การแจ้งเตือน</h3>
                  </div>
                  <div className='max-h-96 overflow-y-auto'>
                    {notifications.map((notif) => (
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

          {/* Divider */}
          <div className='w-px h-8 bg-gray-200' />

          {/* Profile Button */}
          <div className='relative'>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className='flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-xl transition-all duration-200 group'
            >
              <div className='w-9 h-9 rounded-full bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] flex items-center justify-center'>
                <User size={20} className='text-white' />
              </div>
              <div className='hidden md:block text-left'>
                <p className='text-sm font-semibold text-gray-800'>Admin User</p>
                <p className='text-xs text-gray-500'>ผู้ดูแลระบบ</p>
              </div>
              <ChevronDown size={18} className='text-gray-400 group-hover:text-gray-600 hidden md:block' />
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <>
                <div 
                  className='fixed inset-0 z-10' 
                  onClick={() => setShowProfile(false)}
                />
                <div className='absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-20'>
                  <div className='px-4 py-3 bg-gradient-to-r from-[#2E7D32] to-[#388E3C]'>
                    <p className='text-white font-semibold'>Admin User</p>
                    <p className='text-white/80 text-xs'>admin@techjob.com</p>
                  </div>
                  <div className='py-2'>
                    <button className='w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors'>
                      โปรไฟล์
                    </button>
                    <button className='w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors'>
                      ตั้งค่า
                    </button>
                    <div className='border-t border-gray-100 my-1' />
                    <button className='w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors font-medium'>
                      ออกจากระบบ
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