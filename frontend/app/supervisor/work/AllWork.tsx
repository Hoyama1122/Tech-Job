"use client";
import Card from "@/components/Supervisor/work/Card";
import React, { useState } from "react";
import { CardWork } from "@/lib/Mock/CardWork";
import { ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

const Allwork = () => {
  const [statusSearch, setStatusSearch] = useState("ทั้งหมด");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // 🔍 กรองตามสถานะ
  const filteredStatus =
    statusSearch === "ทั้งหมด"
      ? CardWork
      : CardWork.filter((card) => card.status === statusSearch);

  // 📅 เรียงจากใหม่ -> เก่า
  const sortedWork = [...filteredStatus].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // 🧮 Pagination Logic
  const totalPages = Math.ceil(sortedWork.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedWork.slice(startIndex, startIndex + itemsPerPage);

  // ⬅️➡️ Navigation
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // ถ้าเปลี่ยนสถานะ ให้กลับไปหน้า 1
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center gap-3">
        <h1 className="font-title font-semibold text-gray-800 text-lg">
          ใบงานทั้งหมด
        </h1>

        {/* 🔽 ตัวกรองสถานะ */}
        <div className="relative flex">
          <select
            value={statusSearch}
            onChange={handleStatusChange}
            className="
              appearance-none
              bg-accent/90
              border border-gray-300
              text-white
              text-sm md:text-base
              rounded-lg
              px-4
              py-2
              pr-10
              shadow-sm
              focus:outline-none
              focus:ring-2
              cursor-pointer
            "
          >
            <option value="ทั้งหมด">ทั้งหมด</option>
            <option value="รอการตรวจสอบ">รอตรวจสอบ</option>
            <option value="รอการอนุมัติ">รอการอนุมัติ</option>
            <option value="ตีกลั">ตีกลับ</option>
            <option value="สำเร็จ">สำเร็จ</option>
          </select>
          <ArrowDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
        </div>
      </div>

      {/* 📦 Card Section */}
      <div className="mt-5">
        <Card CardWork={currentItems} />
        {/* 🔢 Pagination */}
        <div className="max-w-4xl mx-auto flex justify-between items-center mt-5 text-sm md:text-base">
          <p>
            หน้า {currentPage} จาก {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-3 py-1 flex items-center justify-center border-2 cursor-pointer border-primary rounded hover:bg-primary duration-300 transition-all hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={14} className="mr-1" /> ก่อนหน้า
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-3 py-1 flex items-center justify-center border-2 cursor-pointer border-primary rounded hover:bg-primary duration-300 transition-all hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
