"use client";
import React from "react";

const Settings: React.FC = () => {
  return (
    <div>
      <h1>Settings Page for Technician</h1>

      <div>
        <button className="bg-gray-300 rounded-sm p-2 w-auto mt-4">
          ศูนย์ช่วยเหลือ
        </button>
        <br />
        <button className="bg-gray-300 rounded-sm p-2 w-auto mt-4">
          นโยบายความเป็นส่วนตัว
        </button>
        <br />
        <button className="bg-gray-300 rounded-sm p-2 w-auto mt-4">
          ข้อกำหนดและเงื่อนไข
        </button>
      </div>
    </div>
  );
};

export default Settings;
