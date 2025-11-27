"use client";
import { UserData } from "@/lib/Mock/User";
import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";

const TableTechDepartment = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด");
  const itemsPerPage = 10;

  const auth = localStorage.getItem("auth-storage");
  const parsedAuth = auth ? JSON.parse(auth) : [];
  const supervisorDepartment = parsedAuth.state.department;
 

  const techniciansInDepartment = useMemo(() => {
    if (!supervisorDepartment) return [];
    return UserData.filter(
      (user) => user.role === "Technician" && String(user.department) === String("ช่าง"+ supervisorDepartment)
    );
  }, [supervisorDepartment]);

  const filteredData = techniciansInDepartment.filter((data) => {
    const matchSearch =
      data.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.status.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus =
      statusFilter === "ทั้งหมด" || data.status === statusFilter;

    return matchSearch && matchStatus;
  });

  // คำนวณ pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // เปลี่ยนหน้า
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="mt-4">
      {/* Search */}
      <div className="flex justify-end mb-4">
        <div className="relative w-full md:1/3">
          <Search
            className="absolute left-3 top-[11px] text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="ค้นหา..."
            className="border border-gray-300 rounded-xl pl-10 pr-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            value={searchTerm}
          />
        </div>
        <div className="w-full md:w-1/4">
          <select
            className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-green-500 outline-none"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="ทั้งหมด">ทั้งหมด</option>
            <option value="ว่าง">ว่าง</option>
            <option value="ทำงาน">ทำงาน</option>
            <option value="ไม่ว่าง">ไม่ว่าง</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-center">
          <thead className="uppercase bg-gray-100 text-sm text-left">
            <tr>
              <th className="py-3 px-6 text-center">#</th>
              <th className="py-3 px-6">ชื่อ-นามสกุล</th>
              <th className="py-3 px-6">ตำแหน่ง</th>
              <th className="py-3 px-6">เบอร์โทร</th>
              <th className="py-3 px-6">พื้นที่ทำงาน</th>
              <th className="py-3 px-6">เข้าสู่ระบบล่าสุด</th>
              <th className="py-3 px-6">งานทั้งหมด</th>
              <th className="py-3 px-6">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((data, index) => (
                <tr
                  key={data.id}
                  className="border-b border-gray-200 text-sm hover:bg-secondary cursor-pointer transition-all"
                >
                  <td className="table-body">{startIndex + index + 1}</td>
                  <td className="table-body text-left">{data.username}</td>
                  <td className="table-body text-left">{data.department}</td>
                  <td className="table-body text-left">{data.phone}</td>
                  <td className="table-body text-left">{data.area}</td>
                  <td className="table-body text-left">{data.lastActive}</td>
                  <td className="table-body text-left">{data.totalJobs}</td>
                  <td className="text-left table-body">
                    <span
                      className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        data.status === "ว่าง"
                          ? "bg-green-500"
                          : data.status === "ทำงาน"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    ></span>
                    <span>{data.status}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-5 text-gray-500">
                  ไม่พบข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <p>
          หน้า {currentPage} จาก {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-1 border-2 cursor-pointer border-primary rounded hover:bg-primary duration-300 transition-all hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === 1}
          >
            ก่อนหน้า
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-1 border-2 cursor-pointer border-primary rounded hover:bg-primary duration-300 transition-all hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === totalPages}
          >
            ถัดไป
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableTechDepartment;
