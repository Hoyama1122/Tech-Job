import { Users } from "lucide-react";
import React from "react";

const Team = ({ job }) => {
  
  return (
    <div className="mt-2">
      <div className="">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          ทีมงาน
          <p className="text-xs text-gray-500 mt-1">
            จำนวน: {job.technicianId?.length || 0} คน
          </p>
        </h3>

        {job.technician.length > 0 ? (
          <ul className="space-y-1">
            {job.technician.map((t) => (
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
