import React from "react";
import MainDashboard from "./MainDashboard";
export const metadata = {
  title: "Main",
  description: "เข้าสู่ระบบ Tech Job",
};
const page = () => {
  return (
    <div className="">
      <MainDashboard />
    </div>
  );
};

export default page;
