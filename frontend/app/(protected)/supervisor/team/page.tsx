import React from "react";
import TableTechDepartment from "./TableTechDepartment";
import { Users } from "lucide-react";

export const metadata = {
  title: "Technician user",
};
const page = () => {
  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
              <Users className="w-8 h-8" />
              ข้อมูลช่างในแผนก
            </h1>
            <p className="text-sm text-gray-500 mt-1">รายชื่อช่างในแผนก</p>
          </div>
        </div>
      </div>

      <TableTechDepartment />
    </div>
  );
};

export default page;
