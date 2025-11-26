"use client";

import EditModal from "@/components/Dashboard/TableUser/EditModal";
import {
  ArrowLeft,
  ArrowRight,
  Edit,
  File,
  Filter,
  Search,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 10;

const TablePage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("ทั้งหมด");
  const [currentPage, setCurrentPage] = useState(1);

  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // ⭐ เก็บ user ที่เลือก

  useEffect(() => {
    const GetUser = localStorage.getItem("Users");
    if (GetUser) {
      setUsers(JSON.parse(GetUser));
    }
  }, []);

  // Search
  const filteredSearch = users.filter((item) => {
    const text = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(text) ||
      item.employeeCode.toLowerCase().includes(text) ||
      item.email.toLowerCase().includes(text) ||
      item.phone.toLowerCase().includes(text)
    );
  });

  // Filter ตามแผนก
  const filteredByDept = filteredSearch.filter((item) => {
    if (departmentFilter === "ทั้งหมด") return true;
    return item.department === departmentFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredByDept.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredByDept.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // ⭐ เปิด Modal พร้อมส่ง user ที่เลือกเข้าไป
  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModalEdit(true);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {/* Header + Filters */}
      <div className="flex items-center gap-4 mb-4">
        {/* Search */}
        <div className="w-1/3 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาด้วย รหัสพนักงาน, ชื่อ, อีเมล, เบอร์โทร..."
            className="w-full pl-10 pr-4 py-2.5 border text-sm border-gray-300 rounded-lg"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            className="px-4 py-2.5 border text-sm border-gray-300 rounded-lg bg-white"
            value={departmentFilter}
            onChange={(e) => {
              setDepartmentFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="ทั้งหมด">ทั้งหมด</option>
            <option value="ไฟฟ้า">ไฟฟ้า</option>
            <option value="แอร์">แอร์</option>
            <option value="ประปา">ประปา</option>
            <option value="ผู้บริหาร">ผู้บริหาร</option>
            <option value="แอดมิน">แอดมิน</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse rounded-lg overflow-hidden shadow mt-4">
        <thead>
          <tr className="bg-primary text-white">
            <th className="px-4 py-3 text-left">รหัสพนักงาน</th>
            <th className="px-4 py-3 text-left">ชื่อ-นามสกุล</th>
            <th className="px-4 py-3 text-left">แผนก</th>
            <th className="px-4 py-3 text-left">อีเมล</th>
            <th className="px-4 py-3 text-left">เบอร์โทร</th>
            <th className="px-4 py-3 text-left">ทีม</th>
            <th className="px-4 py-3 text-center">การจัดการ</th>
          </tr>
        </thead>

        <tbody>
          {paginatedData.map((item, index) => (
            <tr
              key={item.id || index}
              className={`border-b border-gray-200 hover:bg-blue-50 transition${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <td className="px-4 py-3">{item.employeeCode}</td>
              <td className="px-4 py-3">{item.name}</td>
              <td className="px-4 py-3">{item.department}</td>
              <td className="px-4 py-3">{item.email}</td>
              <td className="px-4 py-3">{item.phone}</td>
              <td className="px-4 py-3">{item.team?.slice(-1) || "-"}</td>
              <td className="px-4 py-3 text-center">
                <div className="flex items-center gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-primary text-white px-3 py-2 rounded-lg flex items-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    แก้ไข
                  </button>

                  <button className="bg-red-500 text-white px-3 py-2 rounded-lg flex items-center gap-1">
                    <Trash2 className="w-4 h-4" />
                    ลบ
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {paginatedData.length === 0 && (
            <tr>
              <td colSpan={6} className=" text-center py-6 text-gray-500">
                <div className="flex items-center flex-col gap-4">
                  <File className="w-6 h-6" /> ไม่พบข้อมูลที่ค้นหา
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          หน้า {currentPage} จาก {totalPages || 1}
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

      {showModalEdit && (
        <EditModal
          data={selectedUser}
          onClose={() => setShowModalEdit(false)}
        />
      )}
    </div>
  );
};

export default TablePage;
