"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Users } from "@/lib/Mock/UserMock";
import Card from "@/components/Supervisor/work/Card";
import { ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { AppLoader } from "@/store/AppLoader";

const STORAGE_KEY = "CardWork";

const Allwork = () => {
  const { cardWork } = AppLoader();
  const [statusSearch, setStatusSearch] = useState("ทั้งหมด");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // 🔍 ฟิลเตอร์สถานะ
  const filteredStatus = useMemo(() => {
    return statusSearch === "ทั้งหมด"
      ? cardWork
      : cardWork.filter((card) => card.status === statusSearch);
  }, [cardWork, statusSearch]);

  // 📅 เรียงตามวันที่ล่าสุดก่อน
  const sortedWork = useMemo(() => {
    return [...filteredStatus].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [filteredStatus]);

  // 📄 Pagination
  const totalPages = Math.ceil(sortedWork.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedWork.slice(startIndex, startIndex + itemsPerPage);

  // Join ใบงาน + Technician
  const workWithTech = useMemo(() => {
    return currentItems.map((work) => ({
      ...work,
      technician: Users.find(
        (t) => t.id === work.userId && t.role === "technician"
      ) || null,
    }))      

  }, [currentItems]);

  // 🔁 เปลี่ยนหน้า
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center gap-3">
        <h1 className="font-title font-semibold text-gray-800 text-lg">
          ใบงานทั้งหมด (เชื่อมข้อมูลช่างแล้ว)
        </h1>

        {/* ตัวกรองสถานะ */}
        <div className="relative">
          <select
            value={statusSearch}
            onChange={handleStatusChange}
            className="appearance-none bg-accent/90 text-white text-sm rounded-lg px-4 py-2 pr-10 cursor-pointer"
          >
            <option value="ทั้งหมด">ทั้งหมด</option>
            <option value="รอการตรวจสอบ">รอตรวจสอบ</option>
            <option value="รอการอนุมัติ">รอการอนุมัติ</option>
            <option value="ตีกลับ">ตีกลับ</option>
            <option value="สำเร็จ">สำเร็จ</option>
          </select>
          <ArrowDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white" />
        </div>
      </div>

      <div className="mt-5">
        {/* ✅ ส่งข้อมูลที่ join แล้วไปให้ Card */}
        <Card CardWork={workWithTech} />

        {/* Pagination */}
        <div className="max-w-4xl mx-auto flex justify-between items-center mt-5 text-sm">
          <p>
            หน้า {currentPage} จาก {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-3 py-1 flex  items-center justify-center border rounded hover:bg-primary hover:text-white disabled:opacity-50"
            >
              <ArrowLeft size={14} className="mr-1" /> ก่อนหน้า
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-3 py-1 flex  items-center justify-center border rounded hover:bg-primary hover:text-white disabled:opacity-50"
            >
              ถัดไป <ArrowRight size={14} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Allwork;
