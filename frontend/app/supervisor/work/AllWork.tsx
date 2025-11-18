"use client";
import React, { useEffect, useMemo, useState } from "react";
import Card from "@/components/Supervisor/work/Card";
import { ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { AppLoader } from "@/store/AppLoader";
import { Users } from "@/lib/Mock/UserMock";
import { useAuthStore } from "@/store/useAuthStore";

const STORAGE_KEY = "CardWork";

const Allwork = () => {
  const [jobs, setjobs] = useState([])
  const { userId } = useAuthStore();
  const [statusSearch, setStatusSearch] = useState("ทั้งหมด");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  useEffect(() => {
    const cardWork = localStorage.getItem("CardWork");
    if (cardWork) {
      setjobs(JSON.parse(cardWork));
    }
    if(!cardWork) {
    console.log("ไม่มีข้อมูลในlocalstorage");
    
    }
  },[setjobs])
  const myWork = useMemo(() => {
    if (!userId) return [];
    return jobs.filter((work) => work.supervisorId === userId);
  }, [jobs, userId]);

  const filteredStatus = useMemo(() => {
    return statusSearch === "ทั้งหมด"
      ? myWork
      : myWork.filter((card) => card.status === statusSearch);
  }, [myWork, statusSearch]);

  const sortedWork = useMemo(() => {
    return [...filteredStatus].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [filteredStatus]);

  const totalPages = Math.ceil(sortedWork.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedWork.slice(startIndex, startIndex + itemsPerPage);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusSearch(e.target.value);
    setCurrentPage(1);
  };

  const workWithTech = useMemo(() => {
    return currentItems.map((work) => ({
      ...work,
      technician: Users.find((t) => t.id === work.userId) || null,
    }));
  }, [currentItems]);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

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
