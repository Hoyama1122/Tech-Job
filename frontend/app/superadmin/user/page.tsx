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
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import {
  userService,
  type UserItem,
  type CreateUserPayload,
  type UpdateUserPayload,
} from "@/services/user.service";

const ITEMS_PER_PAGE = 10;

type FormState = {
  id?: number;
  empno: string;
  email: string;
  password: string;
  role: string;
  departmentId: string;
  firstname: string;
  lastname: string;
  phone: string;
  address: string;
  avatar: string;
  gender: string;
  birthday: string;
};

const initialForm: FormState = {
  empno: "",
  email: "",
  password: "",
  role: "TECHNICIAN",
  departmentId: "",
  firstname: "",
  lastname: "",
  phone: "",
  address: "",
  avatar: "",
  gender: "",
  birthday: "",
};

const Page = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("ทั้งหมด");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [form, setForm] = useState<FormState>(initialForm);
  const [isSaving, setIsSaving] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await userService.getUsers();
      setUsers(res?.data || []);
    } catch (error: any) {
      console.error("โหลด users ไม่สำเร็จ:", error?.response?.data || error.message);
      alert(error?.response?.data?.message || "โหลดข้อมูลผู้ใช้ไม่สำเร็จ");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
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
    setMode("create");
    setForm(initialForm);
    setOpenModal(true);
  };

  const handleEdit = (user: UserItem) => {
    setMode("edit");
    setForm({
      id: user.id,
      empno: user.empno || "",
      email: user.email || "",
      password: "",
      role: user.role || "TECHNICIAN",
      departmentId: user.department?.id ? String(user.department.id) : "",
      firstname: user.profile?.firstname || "",
      lastname: user.profile?.lastname || "",
      phone: user.profile?.phone || "",
      address: user.profile?.address || "",
      avatar: user.profile?.avatar || "",
      gender: user.profile?.gender || "",
      birthday: user.profile?.birthday
        ? String(user.profile.birthday).slice(0, 10)
        : "",
    });
    setOpenModal(true);
  };

  const handleDelete = async (user: UserItem) => {
    const confirmed = window.confirm(
      `ต้องการลบผู้ใช้ "${user.profile?.firstname || ""} ${
        user.profile?.lastname || ""
      }" หรือไม่?`
    );

    if (!confirmed) return;

    try {
      await userService.deleteUser(user.id);
      await fetchUsers();
    } catch (error: any) {
      console.error("ลบ user ไม่สำเร็จ:", error?.response?.data || error.message);
      alert(error?.response?.data?.message || "ลบผู้ใช้ไม่สำเร็จ");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsSaving(true);

      if (mode === "create") {
        const payload: CreateUserPayload = {
          empno: form.empno,
          email: form.email,
          password: form.password,
          role: form.role,
          departmentId: form.departmentId ? Number(form.departmentId) : null,
          firstname: form.firstname,
          lastname: form.lastname,
          phone: form.phone,
          address: form.address,
          avatar: form.avatar,
          gender: form.gender,
          birthday: form.birthday || undefined,
        };

        await userService.createUser(payload);
      } else {
        const payload: UpdateUserPayload = {
          id: Number(form.id),
          empno: form.empno,
          email: form.email,
          role: form.role,
          departmentId: form.departmentId ? Number(form.departmentId) : null,
          firstname: form.firstname,
          lastname: form.lastname,
          phone: form.phone,
          address: form.address,
          avatar: form.avatar,
          gender: form.gender,
          birthday: form.birthday || undefined,
          ...(form.password ? { password: form.password } : {}),
        };

        await userService.updateUser(payload);
      }

      setOpenModal(false);
      setForm(initialForm);
      await fetchUsers();
    } catch (error: any) {
      console.error("บันทึก user ไม่สำเร็จ:", error?.response?.data || error.message);
      alert(error?.response?.data?.message || "บันทึกข้อมูลไม่สำเร็จ");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 px-4 pt-4 pb-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <Home className="w-8 h-8" />
            จัดการผู้ใช้งาน
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            เพิ่ม แก้ไข ลบ และค้นหาผู้ใช้งานในระบบ
          </p>
        </div>

        <button
          onClick={handleAddUser}
          className="flex items-center gap-2 bg-accent hover:bg-accent/80 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md"
        >
          <CirclePlus className="w-5 h-5" />
          เพิ่มผู้ใช้
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
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-500">
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <File className="h-6 w-6" />
                      ไม่พบข้อมูลที่ค้นหา
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => {
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
                      <td className="px-4 py-3">{item.department?.name || "-"}</td>
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
                })
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

      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {mode === "create" ? "เพิ่มผู้ใช้งาน" : "แก้ไขผู้ใช้งาน"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  กรอกข้อมูลผู้ใช้งานให้ครบถ้วน
                </p>
              </div>

              <button
                onClick={() => setOpenModal(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-5 py-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  className="rounded-lg border px-4 py-3 outline-none focus:border-primary"
                  placeholder="รหัสพนักงาน"
                  value={form.empno}
                  onChange={(e) => setForm({ ...form, empno: e.target.value })}
                  required
                />

                <input
                  className="rounded-lg border px-4 py-3 outline-none focus:border-primary"
                  placeholder="อีเมล"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />

                <input
                  className="rounded-lg border px-4 py-3 outline-none focus:border-primary"
                  placeholder={
                    mode === "create" ? "รหัสผ่าน" : "รหัสผ่านใหม่ (ถ้ามี)"
                  }
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required={mode === "create"}
                />

                <select
                  className="rounded-lg border px-4 py-3 outline-none focus:border-primary"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="SUPERVISOR">SUPERVISOR</option>
                  <option value="TECHNICIAN">TECHNICIAN</option>
                  <option value="EXECUTIVE">EXECUTIVE</option>
                </select>

                <input
                  className="rounded-lg border px-4 py-3 outline-none focus:border-primary"
                  placeholder="ชื่อ"
                  value={form.firstname}
                  onChange={(e) => setForm({ ...form, firstname: e.target.value })}
                />

                <input
                  className="rounded-lg border px-4 py-3 outline-none focus:border-primary"
                  placeholder="นามสกุล"
                  value={form.lastname}
                  onChange={(e) => setForm({ ...form, lastname: e.target.value })}
                />

                <input
                  className="rounded-lg border px-4 py-3 outline-none focus:border-primary"
                  placeholder="เบอร์โทร"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />

                <input
                  className="rounded-lg border px-4 py-3 outline-none focus:border-primary"
                  placeholder="Department ID"
                  value={form.departmentId}
                  onChange={(e) =>
                    setForm({ ...form, departmentId: e.target.value })
                  }
                />

                <input
                  className="rounded-lg border px-4 py-3 outline-none focus:border-primary"
                  placeholder="เพศ"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                />

                <input
                  className="rounded-lg border px-4 py-3 outline-none focus:border-primary"
                  placeholder="วันเกิด"
                  type="date"
                  value={form.birthday}
                  onChange={(e) => setForm({ ...form, birthday: e.target.value })}
                />

                <input
                  className="rounded-lg border px-4 py-3 outline-none focus:border-primary md:col-span-2"
                  placeholder="Avatar URL"
                  value={form.avatar}
                  onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                />

                <input
                  className="rounded-lg border px-4 py-3 outline-none focus:border-primary md:col-span-2"
                  placeholder="ที่อยู่"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="rounded-lg border px-4 py-2.5 text-slate-600 hover:bg-slate-50"
                >
                  ยกเลิก
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-lg bg-primary px-4 py-2.5 text-white disabled:opacity-70"
                >
                  {isSaving
                    ? "กำลังบันทึก..."
                    : mode === "create"
                    ? "เพิ่มผู้ใช้"
                    : "บันทึกการแก้ไข"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;