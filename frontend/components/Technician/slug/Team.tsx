"use client";

import { Users } from "lucide-react";
import React, { useEffect, useState } from "react";

const Team = ({ job }) => {
  const [techList, setTechList] = useState([]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("Users") || "[]");

    const selected = users.filter(
      (u) =>
        u.role === "technician" &&
        Array.isArray(job.technicianId) &&
        job.technicianId.includes(u.id)
    );

    setTechList(selected);
  }, [job]);

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
                  {t.name?.charAt(0)}
                </span>
                {t.name}
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
