"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CirclePlus,
  Edit,
  File,
  Loader2,
  Search,
  Trash2,
  Warehouse,
  X,
} from "lucide-react";
import { department } from "@/services/depertmane.service";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 10;

type DepartmentItem = {
  id: number;
  name: string;
  totalUsers?: number;
  createdAt?: string;
};

type DepartmentFormData = {
  name: string;
};

const initialForm: DepartmentFormData = {
  name: "",
};

const Department = () => {
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedDepartment, setSelectedDepartment] =
    useState<DepartmentItem | null>(null);
  const [formData, setFormData] = useState<DepartmentFormData>(initialForm);
  const [saving, setSaving] = useState(false);

  const fetchDepartments = async () => {
    try {
      setLoading(true);

      const data = await department.getDepartments();

      const departmentList = Array.isArray(data)
        ? data
        : Array.isArray(data?.departments)
          ? data.departments
          : Array.isArray(data?.data)
            ? data.data
            : [];

      setDepartments(departmentList);
    } catch (error) {
      console.error("โหลดแผนกล้มเหลว", error);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const filteredDepartments = useMemo(() => {
    const text = searchTerm.trim().toLowerCase();

    return departments.filter((item) => {
      return item.name?.toLowerCase().includes(text);
    });
  }, [departments, searchTerm]);

  const totalPages =
    Math.ceil(filteredDepartments.length / ITEMS_PER_PAGE) || 1;

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDepartments.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredDepartments, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const closeModal = () => {
    if (saving) return;
    setOpenModal(false);
    setModalMode("create");
    setSelectedDepartment(null);
    setFormData(initialForm);
  };

  const handleAddDepartment = () => {
    setModalMode("create");
    setSelectedDepartment(null);
    setFormData(initialForm);
    setOpenModal(true);
  };

  const handleEdit = (departmentItem: DepartmentItem) => {
    setModalMode("edit");
    setSelectedDepartment(departmentItem);
    setFormData({
      name: departmentItem.name || "",
    });
    setOpenModal(true);
  };

  const handleDelete = async (departmentItem: DepartmentItem) => {
    const confirmed = window.confirm(
      `ต้องการลบแผนก "${departmentItem.name}" ใช่หรือไม่?`,
    );

    if (!confirmed) return;

    try {
      await department.deleteDepartment(departmentItem.id);
      setDepartments((prev) =>
        prev.filter((item) => item.id !== departmentItem.id),
      );
    } catch (error) {
      console.error("ลบแผนกไม่สำเร็จ", error);
      alert("ลบแผนกไม่สำเร็จ");
    }
  };

  const handleSubmitDepartment = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const payload = {
      name: formData.name.trim(),
    };

    if (!payload.name) {
      toast.error("กรุณากรอกชื่อแผนก");
      return;
    }

    try {
      setSaving(true);

      if (modalMode === "create") {
        const created = await department.createDepartment(payload);

        const createdDepartment =
          created?.department || created?.data || created || null;

        if (createdDepartment) {
          setDepartments((prev) => [createdDepartment, ...prev]);
        } else {
          await fetchDepartments();
        }
      } else if (modalMode === "edit" && selectedDepartment) {
        const updated = await department.updateDepartment(
          selectedDepartment.id,
          payload,
        );

        const updatedDepartment =
          updated?.department || updated?.data || updated || null;

        if (updatedDepartment) {
          setDepartments((prev) =>
            prev.map((item) =>
              item.id === selectedDepartment.id
                ? { ...item, ...updatedDepartment }
                : item,
            ),
          );
        } else {
          await fetchDepartments();
        }
      }

      closeModal();
    } catch (error) {
      console.error(
        modalMode === "create" ? "เพิ่มแผนกไม่สำเร็จ" : "แก้ไขแผนกไม่สำเร็จ",
        error,
      );
      toast.error(
        modalMode === "create" ? "มีแผนกนี้แล้ว" : "แก้ไขแผนกไม่สำเร็จ",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="space-y-6 px-4 pb-0 pt-4">
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-primary">
              <Warehouse className="h-8 w-8" />
              จัดการข้อมูลแผนก
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              เพิ่ม แก้ไข และลบข้อมูลแผนกในระบบ
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddDepartment}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-semibold text-white shadow-md transition hover:bg-accent/80"
          >
            <CirclePlus className="h-5 w-5" />
            เพิ่มแผนก
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            title="จำนวนแผนกทั้งหมด"
            value={departments.length}
            icon={<Building2 className="h-5 w-5" />}
            bg="bg-blue-50"
            iconBg="bg-blue-100"
            textColor="text-blue-700"
          />
          <StatCard
            title="แผนกที่แสดงผล"
            value={filteredDepartments.length}
            icon={<File className="h-5 w-5" />}
            bg="bg-emerald-50"
            iconBg="bg-emerald-100"
            textColor="text-emerald-700"
          />
          <StatCard
            title="จำนวนผู้ใช้งานรวม"
            value={departments.reduce(
              (sum, item) => sum + (item.totalUsers || 0),
              0,
            )}
            icon={<Building2 className="h-5 w-5" />}
            bg="bg-amber-50"
            iconBg="bg-amber-100"
            textColor="text-amber-700"
          />
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-md">
          <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full md:w-[420px]">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาชื่อแผนก..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-[#eef2ff] px-4 py-3 text-primary">
              <Building2 className="h-5 w-5" />
              <span className="text-sm font-semibold">
                จำนวนทั้งหมด {filteredDepartments.length} แผนก
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="mt-4 w-full overflow-hidden rounded-lg border-collapse shadow">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="px-4 py-3 text-left">ลำดับ</th>

                  <th className="px-4 py-3 text-left">ชื่อแผนก</th>
                  <th className="px-4 py-3 text-left">จำนวนผู้ใช้</th>
                  <th className="px-4 py-3 text-center">การจัดการ</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-gray-500">
                      กำลังโหลดข้อมูล...
                    </td>
                  </tr>
                ) : paginatedData.length > 0 ? (
                  paginatedData.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-b border-gray-200 transition hover:bg-blue-50 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-4 py-3">
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </td>

                      <td className="px-4 py-3 font-medium text-slate-800">
                        {item.name}
                      </td>

                      <td className="px-4 py-3">{item.totalUsers || 0}</td>

                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
                            className="flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-white"
                          >
                            <Edit className="h-4 w-4" />
                            แก้ไข
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            className="flex items-center gap-1 rounded-lg bg-red-500 px-3 py-2 text-white"
                          >
                            <Trash2 className="h-4 w-4" />
                            ลบ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <File className="h-6 w-6" />
                        ไม่พบข้อมูลแผนก
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
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white disabled:bg-gray-300"
              >
                <ArrowLeft className="h-4 w-4" />
                ก่อนหน้า
              </button>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white disabled:bg-gray-300"
              >
                ถัดไป
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {openModal && (
        <DepartmentModal
          mode={modalMode}
          formData={formData}
          setFormData={setFormData}
          onClose={closeModal}
          onSubmit={handleSubmitDepartment}
          saving={saving}
        />
      )}
    </>
  );
};

function DepartmentModal({
  mode,
  formData,
  setFormData,
  onClose,
  onSubmit,
  saving,
}: {
  mode: "create" | "edit";
  formData: DepartmentFormData;
  setFormData: React.Dispatch<React.SetStateAction<DepartmentFormData>>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  saving: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-[2px]">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
        <div className="relative border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/70 px-6 py-5">
          <div className="pr-12">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              {mode === "create" ? "เพิ่มแผนก" : "แก้ไขแผนก"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {mode === "create"
                ? "กรอกข้อมูลเพื่อสร้างแผนกใหม่ในระบบ"
                : "อัปเดตรายละเอียดแผนกให้เป็นข้อมูลล่าสุด"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 px-6 py-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              ชื่อแผนก
            </label>

            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="เช่น Maintenance"
              className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "create" ? "บันทึกแผนก" : "อัปเดตแผนก"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
function StatCard({
  title,
  value,
  icon,
  bg,
  iconBg,
  textColor,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  bg: string;
  iconBg: string;
  textColor: string;
}) {
  return (
    <div className={`rounded-2xl border border-slate-200 p-5 shadow-sm ${bg}`}>
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg} ${textColor}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-slate-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default Department;
