import React from "react";
import TablePage from "./TablePage";
import { Users } from "lucide-react";
export const metadata = {
  title: "จัดการผู้ใช้งาน",
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
              ข้อมูลผู้ใช้งาน
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              รายชื่อผู้ใช้งานทั้งหมด
            </p>
          </div>
        </div>
      </div>

      <TablePage />
    </div>
  );
};

export default page;
