"use client";
import Link from "next/link";
import React from "react";

const Settings: React.FC = () => {
  return (
    <div className="p-4 mx-auto max-w-md">
      
      <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
        การตั้งค่า (Settings)
      </h1>

      <div className="flex flex-col space-y-4">
        
        <div className="w-full">
          <Link 
            href={'/technician/settings/help'} 
            className="flex justify-between items-center w-full bg-white text-gray-800 border border-gray-200 rounded-lg p-4 transition duration-200 ease-in-out shadow-sm hover:shadow-md hover:bg-gray-50"
          >
            <span className="font-medium text-lg">
              ศูนย์ช่วยเหลือ
            </span>
            <span className="text-gray-400">
              {/* สัญลักษณ์ลูกศรชี้ไปด้านขวา */}
              &gt;
            </span>
          </Link>
        </div>

        <div className="w-full">
          <button 
            className="flex justify-between items-center w-full bg-white text-gray-800 border border-gray-200 rounded-lg p-4 transition duration-200 ease-in-out shadow-sm hover:shadow-md hover:bg-gray-50"
          >
            <Link href={'/technician/settings/privacy'} className="font-medium text-lg">
              นโยบายความเป็นส่วนตัว
            </Link>
            <span className="text-gray-400">
              &gt;
            </span>
          </button>
        </div>
        
        <div className="w-full">
          <button 
            className="flex justify-between items-center w-full bg-white text-gray-800 border border-gray-200 rounded-lg p-4 transition duration-200 ease-in-out shadow-sm hover:shadow-md hover:bg-gray-50"
          >
            <Link href={'/technician/settings/terms'} className="font-medium text-lg">
              ข้อกำหนดและเงื่อนไข
            </Link>
            <span className="text-gray-400">
              &gt;
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Settings;