"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, FileEdit, Search } from "lucide-react";
import { Users } from "@/lib/Mock/UserMock";

export default function TableTechDepartment() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [supervisorDept, setSupervisorDept] = useState("");
  const [myId, setMyId] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    const authRaw = localStorage.getItem("auth-storage");
    if (!authRaw) return;

    const auth = JSON.parse(authRaw);
    setMyId(auth?.state?.userId || null);
    setSupervisorDept(auth?.state?.department || "");
  }, []);

  // -----------------------------
  // รวม: Supervisor ตัวเอง + Technicians ในแผนก
  // -----------------------------
  const people = Users.filter(
    (u) =>
      // ช่างในแผนก
      (u.role === "technician" && u.department === supervisorDept) ||
      // Supervisor ตัวเอง
      (u.role === "supervisor" && u.id === myId)
  );

  // -----------------------------
  // Search
  // -----------------------------
  const filteredList = people.filter((p) => {
    const s = searchTerm.toLowerCase();

    return (
      p.name.toLowerCase().includes(s) ||
      p.phone.toLowerCase().includes(s) ||
      (p.email && p.email.toLowerCase().includes(s))
    );
  });

  // -----------------------------
  // Pagination
  // -----------------------------
  const totalPages = Math.ceil(filteredList.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageItems = filteredList.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        {/* Search */}
        <div className="w-1/3 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหา ชื่อ, เบอร์โทร, อีเมล..."
            className="w-full pl-10 pr-4 py-2.5 border text-sm border-gray-300 rounded-lg"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse rounded-lg overflow-hidden shadow mt-4">
        <thead>
          <tr className="bg-primary text-white">
            <th className="px-4 py-3 text-left">รหัสพนักงาน</th>
            <th className="px-4 py-3 text-left">ชื่อ-นามสกุล</th>
            <th className="px-4 py-3 text-left">ตำแหน่ง</th>
            <th className="px-4 py-3 text-left">แผนก</th>
            <th className="px-4 py-3 text-left">อีเมล</th>
            <th className="px-4 py-3 text-left">เบอร์โทร</th>
          </tr>
        </thead>

        <tbody>
          {pageItems.map((p, index) => (
            <tr
              key={p.id || index}
              className={`border-b border-gray-200 hover:bg-blue-50 transition ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <td className="px-4 py-3">{p.employeeCode}</td>
              <td className="px-4 py-3">
                {p.id === myId ? `${p.name} (คุณ)` : p.name}
              </td>
              <td className="px-4 py-3">
                {p.role === "supervisor" ? "หัวหน้าแผนก" : "ช่าง"}
              </td>
              <td className="px-4 py-3">{p.department}</td>
              <td className="px-4 py-3">{p.email}</td>
              <td className="px-4 py-3">{p.phone}</td>
            </tr>
          ))}

          {pageItems.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-6 text-gray-500">
                <div className="flex flex-col items-center gap-4">
                  <FileEdit className="w-6 h-6" />
                  ไม่พบข้อมูลที่ค้นหา
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <p>
          หน้า {currentPage} จาก {totalPages}
        </p>

        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 flex items-center gap-2 bg-primary text-white rounded-lg disabled:bg-gray-300"
          >
            <ArrowLeft className="w-4 h-4" />
            ก่อนหน้า
          </button>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 flex items-center gap-2 bg-primary text-white rounded-lg disabled:bg-gray-300"
          >
            <ArrowRight className="w-4 h-4" />
            ถัดไป
          </button>
        </div>
      </div>
    </div>
  );
}
