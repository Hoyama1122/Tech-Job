import { Clock } from "lucide-react";
import React from "react";
import { useFormContext } from "react-hook-form";

const Time = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div lang="th" className="relative w-full max-w-md mt-4">
      <label className="flex items-center gap-1 text-gray-700 mb-1 text-lg">
        <Clock size={16} className="text-primary" />
        ช่วงเวลา <span className="text-red-500">*</span>
      </label>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* เวลาเริ่มต้น */}
        <div className="flex-1">
          <input
            {...register("startTime")}
            type="time"
            lang="th"
            className="input-field"
            min="00:00"
            max="23:59"
          
          />
          {errors.startTime && (
            <p className="text-xs text-red-500 mt-1 px-1">
              {errors.startTime.message as string}
            </p>
          )}
        </div>

        <span className="text-gray-500 text-center sm:text-left">ถึง</span>

        {/* เวลาสิ้นสุด */}
        <div className="flex-1">
          <input
            {...register("endTime")}
            type="time"
            lang="th"
            className="input-field"
            min="00:00"
            max="23:59"
          
          />
          {errors.endTime && (
            <p className="text-xs text-red-500 mt-1 px-1">
              {errors.endTime.message as string}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Time;
