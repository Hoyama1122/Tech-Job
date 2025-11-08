"use client";
import React, { useEffect, useState } from "react";

const months = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];
const thaiDays = [
  "อาทิตย์",
  "จันทร์",
  "อังคาร",
  "พุธ",
  "พฤหัสบดี",
  "ศุกร์",
  "เสาร์",
];

function DateFormat() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  const day = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  const dayName = thaiDays[now.getDay()];
  const time = now.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return (
    <div className="flex space-x-2 text-2xl">
      <p>
        วัน{dayName}ที่ {""}
      </p>
      <p>{day} </p>
      <p>{month}</p>
      <p>{year}</p>
      <p>เวลา {time} น.</p>
    </div>
  );
}
export default DateFormat;
