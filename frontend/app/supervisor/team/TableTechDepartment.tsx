"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Users } from "@/lib/Mock/UserMock";

export default function TableTechDepartment() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด");
  const [currentPage, setCurrentPage] = useState(1);
  const [supervisorDept, setSupervisorDept] = useState("");

  const itemsPerPage = 10;


  useEffect(() => {
    const authRaw = localStorage.getItem("auth-storage");
    if (!authRaw) return;

    const auth = JSON.parse(authRaw);
    if (auth?.state?.department) {
      setSupervisorDept(auth.state.department);
    }
  }, []);

 
  const technicians = Users.filter(
    (u) => u.role === "technician" && u.department === supervisorDept
  );

  // Filter + Search แบบง่าย
  const filteredTechs = technicians.filter((t) => {
    const s = searchTerm.toLowerCase();

    const matchSearch =
      t.name.toLowerCase().includes(s) ||
      t.phone.toLowerCase().includes(s) ||
      t.area.toLowerCase().includes(s);

    const matchStatus =
      statusFilter === "ทั้งหมด" || t.status === statusFilter;

    return matchSearch && matchStatus;
  });

  // Pagination แบบง่าย
  const totalPages = Math.ceil(filteredTechs.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageItems = filteredTechs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="mt-6">

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-3 justify-between mb-4">

        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="ค้นหาช่างในแผนก..."
            className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/40 outline-none"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-1/4 py-2.5 px-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/40 outline-none"
        >
          <option value="ทั้งหมด">ทั้งหมด</option>
          <option value="ว่าง">ว่าง</option>
          <option value="ทำงาน">ทำงาน</option>
          <option value="ไม่ว่าง">ไม่ว่าง</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden shadow-md bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr className="text-left text-xs uppercase">
              <th className="p-3">#</th>
              <th className="p-3">ชื่อ - นามสกุล</th>
              <th className="p-3">เบอร์โทร</th>
              <th className="p-3">พื้นที่ทำงาน</th>
              <th className="p-3">สถานะ</th>
            </tr>
          </thead>

          <tbody>
            {pageItems.length > 0 ? (
              pageItems.map((t, i) => (
                <tr
                  key={t.id}
                  className="border-b last:border-none hover:bg-gray-100/60 transition cursor-pointer"
                >
                  <td className="p-3">{startIndex + i + 1}</td>
                  <td className="p-3 font-medium">{t.name}</td>
                  <td className="p-3">{t.phone}</td>
                  <td className="p-3">{t.area}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-2 text-sm">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          t.status === "ว่าง"
                            ? "bg-green-500"
                            : t.status === "ทำงาน"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      />
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-6 text-gray-500">
                  ไม่พบข้อมูลช่างในแผนก
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
            className="px-3 py-1.5 border border-primary text-primary rounded-lg disabled:opacity-40 disabled:cursor-default hover:bg-primary hover:text-white transition"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            ก่อนหน้า
          </button>

          <button
            className="px-3 py-1.5 border border-primary text-primary rounded-lg disabled:opacity-40 disabled:cursor-default hover:bg-primary hover:text-white transition"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            ถัดไป
          </button>
        </div>
      </div>
    </div>
  );
}
