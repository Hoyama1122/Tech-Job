"use client";
import React, { useEffect, useState } from "react";
import { CardWork as defaultWork } from "@/lib/Mock/CardWork";
import { TechnicianMock } from "@/lib/Mock/Technician";
import Card from "@/components/Supervisor/work/Card";
import { ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

const STORAGE_KEY = "CardWork";

const Allwork = () => {
  const [cardWork, setCardWork] = useState(defaultWork);
  const [statusSearch, setStatusSearch] = useState("ทั้งหมด");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCardWork(JSON.parse(saved));
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultWork));
      }
    } catch (error) {
      console.error("โหลดข้อมูลไม่สำเร็จ:", error);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultWork));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cardWork));
  }, [cardWork]);

  //  ฟิลเตอร์สถานะ
  const filteredStatus =
    statusSearch === "ทั้งหมด"
      ? cardWork
      : cardWork.filter((card) => card.status === statusSearch);

  //  เรียงตามวันที่
  const sortedWork = [...filteredStatus].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  //  Pagination
  const totalPages = Math.ceil(sortedWork.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedWork.slice(startIndex, startIndex + itemsPerPage);

  //  JOIN ใบงาน + Technician
  const workWithTech = currentItems.map((work) => ({
    ...work,
    technician: TechnicianMock.find((t) => t.id === work.userId) || null,
  }));

  // เปลี่ยนหน้า
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
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
              className="px-3 py-1 border rounded hover:bg-primary hover:text-white disabled:opacity-50"
            >
              <ArrowLeft size={14} className="mr-1" /> ก่อนหน้า
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded hover:bg-primary hover:text-white disabled:opacity-50"
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
