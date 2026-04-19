"use client";

import { Users } from "lucide-react";
import React, { useEffect, useState } from "react";

const Team = ({ job }) => {
 
  const assignments = job.assignments || [];

  const techList = assignments;

  return (
    <div className="mt-2">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          ทีมงาน
          <p className="text-xs text-gray-500 mt-1">
            จำนวน: {techList.length} คน
          </p>
        </h3>

        {techList.length > 0 ? (
          <ul className="space-y-1">
            {techList.map((t) => (
              <li
                key={t.id}
                className="text-gray-700 text-sm flex items-center gap-2"
              >
                <span className="w-6 h-6 bg-blue-100 text-primary rounded-full flex items-center justify-center text-xs font-semibold">
                  {t.fullname?.charAt(0)}
                </span>
                <span className="font-medium text-gray-900">{t.fullname}</span>
                <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">
                  {t.role === 'SUPERVISOR' ? 'หัวหน้า' : 'ช่าง'}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700">ไม่ระบุทีม</p>
        )}
      </div>
    </div>
  );
};

export default Team;
