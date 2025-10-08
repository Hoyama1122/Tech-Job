import React from "react";
import TablePage from "./TablePage";
export const metadata = {
  title: "Technician user",
};
const page = () => {
  return (
    <div className="">
      <div>
        <h1 className="font-title ">ตารางผู้ใช้งาน</h1>
      </div>
      {/* Sort table */}
      <TablePage />
    </div>
  );
};

export default page;
