"use client";
import { useFormContext } from "react-hook-form";
import React, { useEffect } from "react";

const CurrentTime = () => {
  const { register, setValue } = useFormContext();

  useEffect(() => {
    const now = new Date();

    // แปลงเวลาเป็น timezone ไทย (GMT+7)
    const thaiTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);

    // แปลงเป็นรูปแบบ HH:mm
    const hour = String(thaiTime.getUTCHours()).padStart(2, "0");
    const minute = String(thaiTime.getUTCMinutes()).padStart(2, "0");
    const formattedTime = `${hour}:${minute}`;

   
    setValue("startTime", formattedTime);
  }, [setValue]);

  return (
    <div className="w-full mt-2 hidden">
      <label className="block text-lg font-medium text-text mb-1">
        เวลาเริ่มงาน (อัตโนมัติ)
      </label>
      <input
        type="time"
        {...register("startTime")}
        readOnly
        className="input-field bg-gray-100 cursor-not-allowed text-gray-700"
      />
    </div>
  );
};

export default CurrentTime;
