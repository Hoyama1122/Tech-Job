import React from "react";
import MainDashboard from "./MainDashboard";
import Link from "next/link";
import { CirclePlus } from "lucide-react";
export const metadata = {
  title: "หน้าหลัก",
  description: "Tech Job",
};
const page = () => {
  return (
    <div className="">   
      <MainDashboard />
      1
    </div>
  );
};

export default page;
