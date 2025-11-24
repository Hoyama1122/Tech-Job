import { Clock } from "lucide-react";
import React from "react";

const DateTime = ({ time }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-start justify-between h-full">
        <div>
          <p className="text-gray-500 text-sm mb-1">
            {new Date().toLocaleDateString("th-TH", { weekday: "long" })}
          </p>
          <h3 className="text-3xl font-bold text-gray-900">
            {new Date().toLocaleDateString("th-TH", {
              day: "2-digit",
              month: "long",
            })}
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            {new Date().getFullYear() + 543}
          </p>
        </div>
        <div className="text-right flex flex-col items-center justify-center">
          <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
            <Clock size={14} />
            เวลา
          </p>
          <p className="text-3xl font-bold text-primary">{time}</p>
        </div>
      </div>
    </div>
  );
};

export default DateTime;
