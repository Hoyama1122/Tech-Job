"use client";

import React, { useState } from "react";
import { Search, Edit, Save, X } from "lucide-react";
import { Users as InitialUsers } from "@/lib/Mock/UserMock";

// กำหนด Type สำหรับข้อมูลผู้ใช้
interface UserType {
  id: number;
  employeeCode: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  area?: string;
  status?: string;
  lastActive?: string;
  totalJobs?: number;
}

const TablePage = () => {
  // ใช้ state เพื่อจัดการข้อมูลที่สามารถแก้ไขได้
  const [users, setUsers] = useState<UserType[]>(InitialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<Partial<UserType>>({});
  const itemsPerPage = 10;

  // กรองข้อมูลตามคำค้นหา
  const filteredData = users.filter((data) => {
    const matchSearch =
      data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.phone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus =
      statusFilter === "ทั้งหมด" || (data.status || "ว่าง") === statusFilter;

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

  // เริ่มต้นแก้ไขข้อมูล
  const handleEdit = (item: UserType) => {
    setEditingId(item.id);
    setEditedData({
      ...item,
      area: item.area || "ไม่ระบุ",
      status: item.status || "ว่าง",
      lastActive: item.lastActive || "-",
      totalJobs: item.totalJobs || 0,
    });
  };

  // บันทึกข้อมูล
  const handleSave = () => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === editingId ? { ...user, ...editedData } : user
      )
    );
    console.log("กำลังบันทึกข้อมูล:", editedData);
    setEditingId(null);
    setEditedData({});
  };

  // ยกเลิกการแก้ไข
  const handleCancel = () => {
    setEditingId(null);
    setEditedData({});
  };

  // อัพเดทข้อมูลใน input
  const handleInputChange = (field: keyof UserType, value: string | number) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="mt-4">
      {/* Search */}
      <div className="flex justify-end mb-4 gap-3">
        <div className="relative w-full md:w-1/3">
          <Search
            className="absolute left-3 top-[11px] text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="ค้นหา..."
            className="border border-gray-300 rounded-xl pl-10 pr-3 py-2 focus:ring-2 focus:ring-green-500 outline-none w-full"
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
              <th className="py-3 px-6">รหัสพนักงาน</th>
              <th className="py-3 px-6">อีเมล</th>
              <th className="py-3 px-6">เบอร์โทร</th>
              <th className="py-3 px-6">ตำแหน่ง</th>
              <th className="py-3 px-6">งานทั้งหมด</th>
              <th className="py-3 px-6">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((data, index) => {
                const isEditing = editingId === data.id;

                return (
                  <tr
                    key={data.id}
                    className="border-b border-gray-200 text-sm hover:bg-gray-50 transition-all"
                  >
                    <td className="py-3 px-6 text-center">
                      {isEditing ? (
                        <span className="text-gray-500">{data.id}</span>
                      ) : (
                        startIndex + index + 1
                      )}
                    </td>
                    <td className="py-3 px-6">
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                          value={editedData.name || ""}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                        />
                      ) : (
                        data.name
                      )}
                    </td>
                    <td className="py-3 px-6">
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full px-2 py-1 border rounded bg-gray-100"
                          value={editedData.employeeCode || ""}
                          disabled
                        />
                      ) : (
                        data.employeeCode
                      )}
                    </td>
                    <td className="py-3 px-6">
                      {isEditing ? (
                        <input
                          type="email"
                          className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                          value={editedData.email || ""}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                        />
                      ) : (
                        data.email
                      )}
                    </td>
                    <td className="py-3 px-6">
                      {isEditing ? (
                        <input
                          type="tel"
                          className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                          value={editedData.phone || ""}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                        />
                      ) : (
                        data.phone
                      )}
                    </td>
                    <td className="py-3 px-6">
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                          value={editedData.role || ""}
                          onChange={(e) =>
                            handleInputChange("role", e.target.value)
                          }
                        />
                      ) : (
                        data.role
                      )}
                    </td>
                    <td className="py-3 px-6">
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                          value={editedData.area || ""}
                          onChange={(e) =>
                            handleInputChange("area", e.target.value)
                          }
                        />
                      ) : (
                        data.area || "ไม่ระบุ"
                      )}
                    </td>

                    <td className="py-3 px-6">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button
                            onClick={handleSave}
                            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="บันทึก"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="ยกเลิก"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(data)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="แก้ไข"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={11} className="py-5 text-gray-500">
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
            className="px-3 py-1 border-2 border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white duration-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === 1}
          >
            ก่อนหน้า
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-1 border-2 border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white duration-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === totalPages}
          >
            ถัดไป
          </button>
        </div>
      </div>
    </div>
  );
};

export default TablePage;
