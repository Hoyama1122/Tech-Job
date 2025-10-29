import React from "react";

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

const today = new Date();
const Day = today.getDate().toString().padStart(2, "0");
const Month = today.getMonth();
const Year = today.getFullYear().toString();

function DateFormat() {
  return (
    <div className="flex space-x-2 text-2xl">
      <p>{Day} </p>
      <p>{months[Month]}</p>
      <p>{Year}</p>
    </div>
  );
}
export default DateFormat;