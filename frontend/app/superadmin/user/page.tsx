"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CirclePlus,
  Edit,
  File,
  Filter,
  Home,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";

const ITEMS_PER_PAGE = 10;

type UserItem = {
  id: number;
  empno: string;
  email: string;
  role: string;
  department?: {
    id: number;
    name: string;
  } | null;
  profile?: {
    firstname?: string | null;
    lastname?: string | null;
    phone?: string | null;
  } | null;
};

const mockUsers: UserItem[] = [
  {
    id: 1,
    empno: "ADM001",
    email: "admin@techjob.com",
    role: "ADMIN",
    department: { id: 1, name: "Admin" },
    profile: {
      firstname: "สมชาย",
      lastname: "แอดมิน",
      phone: "0811111111",
    },
  },
  {
    id: 2,
    empno: "SPV001",
    email: "supervisor@techjob.com",
    role: "SUPERVISOR",
    department: { id: 2, name: "Maintenance" },
    profile: {
      firstname: "มานะ",
      lastname: "คุมงาน",
      phone: "0822222222",
    },
  },
  {
    id: 3,
    empno: "TCH001",
    email: "tech1@techjob.com",
    role: "TECHNICIAN",
    department: { id: 2, name: "Maintenance" },
    profile: {
      firstname: "วิชัย",
      lastname: "ช่างไฟ",
      phone: "0830003333",
    },
  },
  {
    id: 4,
    empno: "EXE001",
    email: "executive@techjob.com",
    role: "EXECUTIVE",
    department: { id: 3, name: "Management" },
    profile: {
      firstname: "ศิริพร",
      lastname: "ผู้บริหาร",
      phone: "0844444444",
    },
  },
];

const Page = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("ทั้งหมด");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setUsers(mockUsers);
  }, []);

  const departmentOptions = useMemo(() => {
    const names = users
      .map((item) => item.department?.name)
      .filter((name): name is string => Boolean(name));

    return ["ทั้งหมด", ...Array.from(new Set(names))];
  }, [users]);

  const filteredUsers = useMemo(() => {
    const text = searchTerm.trim().toLowerCase();

    return users.filter((item) => {
      const fullName = `${item.profile?.firstname || ""} ${
        item.profile?.lastname || ""
      }`
        .trim()
        .toLowerCase();

      const matchSearch =
        !text ||
        item.empno.toLowerCase().includes(text) ||
        item.email.toLowerCase().includes(text) ||
        (item.profile?.phone || "").toLowerCase().includes(text) ||
        fullName.includes(text) ||
        (item.department?.name || "").toLowerCase().includes(text) ||
        (item.role || "").toLowerCase().includes(text);

      const matchDepartment =
        departmentFilter === "ทั้งหมด" ||
        item.department?.name === departmentFilter;

      return matchSearch && matchDepartment;
    });
  }, [users, searchTerm, departmentFilter]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE) || 1;

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const handleAddUser = () => {
    console.log("add user");
  };

  const handleEdit = (user: UserItem) => {
    console.log("edit user", user);
  };

  const handleDelete = (user: UserItem) => {
    const confirmed = window.confirm(
      `ต้องการลบผู้ใช้ "${user.profile?.firstname || ""} ${
        user.profile?.lastname || ""
      }" หรือไม่?`
    );

    if (!confirmed) return;

    setUsers((prev) => prev.filter((u) => u.id !== user.id));
  };

  return (
    <div className="space-y-6 px-4 pt-4 pb-0"> 
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <Home className="w-8 h-8" />
            หน้าหลัก
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            ภาพรวมระบบจัดการงานช่าง
          </p>
        </div>
        <button className="button-create flex items-center gap-2 bg-accent hover:bg-accent/80 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md">
          <CirclePlus className="w-5 h-5" />
          สร้างงานใหม่
        </button>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-md">
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center">
            <div className="relative w-full md:w-[420px]">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหา รหัสพนักงาน, ชื่อ, อีเมล, เบอร์โทร..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
                value={departmentFilter}
                onChange={(e) => {
                  setDepartmentFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {departmentOptions.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-[#eef2ff] px-4 py-3 text-primary">
            <Users className="h-5 w-5" />
            <span className="text-sm font-semibold">
              จำนวนทั้งหมด {filteredUsers.length} คน
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="mt-4 w-full overflow-hidden rounded-lg border-collapse shadow">
            <thead>
              <tr className="bg-primary text-white">
                <th className="px-4 py-3 text-left">รหัสพนักงาน</th>
                <th className="px-4 py-3 text-left">ชื่อ-นามสกุล</th>
                <th className="px-4 py-3 text-left">แผนก</th>
                <th className="px-4 py-3 text-left">อีเมล</th>
                <th className="px-4 py-3 text-left">เบอร์โทร</th>
                <th className="px-4 py-3 text-left">สิทธิ์</th>
                <th className="px-4 py-3 text-center">การจัดการ</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((item, index) => {
                const fullName =
                  `${item.profile?.firstname || ""} ${
                    item.profile?.lastname || ""
                  }`.trim() || "-";

                return (
                  <tr
                    key={item.id}
                    className={`border-b border-gray-200 transition hover:bg-blue-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3">{item.empno}</td>
                    <td className="px-4 py-3">{fullName}</td>
                    <td className="px-4 py-3">
                      {item.department?.name || "-"}
                    </td>
                    <td className="px-4 py-3">{item.email}</td>
                    <td className="px-4 py-3">{item.profile?.phone || "-"}</td>
                    <td className="px-4 py-3">{item.role}</td>

                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-white"
                        >
                          <Edit className="h-4 w-4" />
                          แก้ไข
                        </button>

                        <button
                          onClick={() => handleDelete(item)}
                          className="flex items-center gap-1 rounded-lg bg-red-500 px-3 py-2 text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <File className="h-6 w-6" />
                      ไม่พบข้อมูลที่ค้นหา
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-gray-600">
            หน้า {currentPage} จาก {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white disabled:bg-gray-300"
            >
              <ArrowLeft className="h-4 w-4" />
              ก่อนหน้า
            </button>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white disabled:bg-gray-300"
            >
              ถัดไป
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
