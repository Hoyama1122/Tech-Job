"use client";

import React, { useEffect, useState } from "react";
import {
  PackagePlus,
  Search,
  Filter,
  Plus,
  FileText,
  X,
  Edit,
  Trash2,
} from "lucide-react";
import { itemService } from "@/services/item.service";
import EquipmentForm from "@/components/Dashboard/Form/EquipmentForm";
import { toast } from "react-toastify";

const EquipmentDashboard = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deletingItem, setDeletingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await itemService.getItems();
      setItems(data);
    } catch (error) {
      console.error("Fetch items error:", error);
      toast.error("ไม่สามารถโหลดข้อมูลอุปกรณ์ได้");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      await itemService.deleteItem(deletingItem.id);
      toast.success("ลบพัสดุสำเร็จ");
      setDeletingItem(null);
      fetchData();
    } catch (error) {
      toast.error("ไม่สามารถลบพัสดุได้");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "ALL" || item.type === filterType;

    return matchesSearch && matchesType;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to page 1 when searching or filtering
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  const PaginationControls = () => (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
      >
        ก่อนหน้า
      </button>
      <span className="text-[11px] text-gray-500 font-bold px-3">
        หน้า {currentPage} / {totalPages || 1}
      </span>
      <button
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages || totalPages === 0}
        className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
      >
        ถัดไป
      </button>
    </div>
  );

  return (
    <div className="p-4 min-h-screen">
      <div className="w-full space-y-4">
        {/* Top Header & Add Button */}
        <div className="flex justify-between items-center ">
          <div className="flex items-center gap-4">
            <div className=" flex items-center justify-center text-gray-500">
              <PackagePlus size={22} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Management Equipment
              </h1>
              <p className="text-sm text-gray-500">
                Manage your equipment and supplies
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="button-create !py-2 !px-4 !text-sm"
          >
            <Plus size={18} />
            เพิ่มอุปกรณ์
          </button>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 ">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3 mb-2">
              รายการพัสดุทั้งหมด{" "}
              <FileText size={16} className="text-gray-400" />
            </h2>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row items-center gap-3 mb-1">
            <div className="relative flex-1 w-full text-gray-400 focus-within:text-gray-600 border-gray-300">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2"
                size={16}
              />
              <input
                type="text"
                placeholder="ค้นหา..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-gray-400 transition-all text-sm text-gray-700"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="text-gray-400" size={18} />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm text-gray-700 outline-none focus:border-gray-400 flex-1 md:w-44 appearance-none cursor-pointer"
              >
                <option value="ALL">ทุกประเภท</option>
                <option value="EQUIPMENT">อุปกรณ์</option>
                <option value="MATERIAL">วัสดุสิ้นเปลือง</option>
              </select>
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-6 tracking-wide">
            ({filteredItems.length} รายการ)
          </p>

          {/* Table */}
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="px-6 py-4 text-sm font-semibold first:rounded-tl-lg">
                    รหัสพัสดุ
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold">
                    ชื่อพัสดุ / รายละเอียด
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold">ประเภท</th>
                  <th className="px-6 py-4 text-sm font-semibold">
                    จำนวนคงเหลือ
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-center last:rounded-tr-lg">
                    ดำเนินการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {loading ? (
                  Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={5} className="px-6 py-6">
                          <div className="h-6 bg-gray-100 rounded w-full"></div>
                        </td>
                      </tr>
                    ))
                ) : currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                        {item.code}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-800">
                            {item.name}
                          </span>
                          <span className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {item.brand} {item.model}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.type === "EQUIPMENT"
                          ? "อุปกรณ์"
                          : "วัสดุสิ้นเปลือง"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                          {Number(item.quantity).toLocaleString()}
                          <span className="text-gray-500 text-xs font-normal">
                            {item.unit}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setShowModal(true);
                            }}
                            className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-[13px] font-bold rounded-lg hover:bg-primary-hover transition-all"
                          >
                            <Edit size={12} />
                            แก้ไข
                          </button>
                          <button
                            onClick={() => setDeletingItem(item)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-danger text-white text-[13px] font-bold rounded-lg hover:bg-danger-hover transition-all"
                          >
                            <Trash2 size={12} />
                            ลบ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-20 text-center text-gray-400 font-medium"
                    >
                      ไม่พบข้อมูลพัสดุ
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <PaginationControls />
        </div>
      </div>

      {/* Main Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => {
              setShowModal(false);
              setEditingItem(null);
            }}
          ></div>
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 border border-gray-100">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-20">
              <h2 className="text-lg font-bold text-gray-900">
                {editingItem ? "แก้ไขพัสดุ" : "เพิ่มอุปกรณ์ใหม่"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingItem(null);
                }}
                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              <EquipmentForm
                initialData={editingItem}
                onSuccess={() => {
                  setShowModal(false);
                  setEditingItem(null);
                  fetchData();
                }}
                isModal={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setDeletingItem(null)}
          ></div>
          <div className="bg-white max-w-md w-full rounded-2xl p-8 relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-2">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                ยืนยันการลบข้อมูลพัสดุ?
              </h3>
              <p className="text-gray-500 text-sm">
                คุณแน่ใจหรือไม่ว่าต้องการลบ{" "}
                <span className="font-bold text-gray-800">
                  "{deletingItem.name}"
                </span>
                ? ข้อมูลนี้จะถูกลบออกจากฐานข้อมูลอย่างถาวรและไม่สามารถกู้คืนได้
              </p>
              <div className="flex w-full gap-3 pt-4">
                <button
                  onClick={() => setDeletingItem(null)}
                  className="flex-1 py-3 bg-gray-50 text-gray-600 font-bold rounded-xl border border-gray-200 hover:bg-gray-100 transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-200 hover:bg-red-700 transition-all font-title"
                >
                  ยืนยันลบ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentDashboard;
