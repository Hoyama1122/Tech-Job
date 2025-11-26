import React from "react";
import TableTechDepartment from "./TableTechDepartment";

export const metadata = {
  title: "Technician user",
};
const page = () => {
  return (
    <div className="">
      <div>
        <h1 className="font-title ">ตารางช่างในแผนก</h1>
      </div>
      {/* Sort table */}
      <TableTechDepartment />
    </div>
  );
};

export default page;
