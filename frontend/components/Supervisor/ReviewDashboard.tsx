"use client";
import { pendingApprovals } from "@/lib/Mock/PendingApprove";
import { useSupervisorStore } from "@/store/useSupervisorStore";
import { ArrowLeft, ArrowRight, Eye } from "lucide-react";
import React, { useState } from "react";

const ReviewDashboard = () => {
  const {
    jobs,
    filterStatus,
    currentPage,
    itemsPerPage,
    setJobs,
    setCurrentPage,
    setFilterStatus,
  } = useSupervisorStore();

  // filter
  const filteredItems =
    filterStatus === "ทั้งหมด"
      ? pendingApprovals
      : pendingApprovals.filter((item) => item.status === filterStatus);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "รอการตรวจสอบ":
        return "bg-[#f0ad4e] text-white";
      case "ตีกลับ":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const Previous = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const Next = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  return (
    <div className=" bg-white rounded-lg p-3 md:p-4 shadow-md">
      {/* Header */}
      <div className="flex mb-4 items-center justify-between">
        <h1 className="text-base md:text-lg font-bold text-text px-2">
          รอการตรวจสอบ/อนุมัติ
        </h1>
        {/* ตัวกรองสถานะ */}
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
        >
          <option value="ทั้งหมด">ทั้งหมด</option>
          <option value="รอการตรวจสอบ">รอการตรวจสอบ</option>
          <option value="รอการอนุมัติ">รอการอนุมัติ</option>
          <option value="ตีกลับ">ตีกลับ</option>
          <option value="สำเร็จ">สำเร็จ</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary border-t border-b border-gray-300 text-xs">
              <th className="px-3 py-3 text-left font-semibold text-white">
                หมายเลข
              </th>
              <th className="px-3 py-3 text-left font-semibold text-white">
                ชื่อผู้ใช้
              </th>
              <th className="px-3 py-3 text-left font-semibold text-white">
                งาน
              </th>
              <th className="px-3 py-3 text-left font-semibold text-white">
                ระยะเวลา
              </th>
              <th className="px-3 py-3 text-left font-semibold text-white">
                สถานะ
              </th>
              <th className="px-3 py-3 text-center font-semibold text-white">
                การดำเนินการ
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr
                key={item.id}
                className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-3 py-3 text-[14px] text-primary font-medium">
                  {item.jobId}
                </td>
                <td className="px-3 py-3 text-[14px] text-primary font-medium">
                  {item.name}
                </td>
                <td className="px-3 py-3 text-[14px] text-text font-medium">
                  {item.jobTitle}
                </td>
                <td className="px-3 py-3 text-[14px] text-text">{item.sla}</td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-medium whitespace-nowrap ${getStatusClass(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-3 py-3 text-center">
                  <button className="bg-primary hover:bg-primary-hover cursor-pointer transition-all duration-300 rounded p-2 inline-flex items-center justify-center">
                    <Eye size={18} className="text-white" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="justify-between items-center mt-4 text-sm hidden md:flex">
        <p>
          หน้า {currentPage} จาก {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            onClick={Previous}
            disabled={currentPage === 1}
            className="px-3 py-1 flex items-center justify-center border-2 cursor-pointer border-primary rounded hover:bg-primary duration-300 transition-all hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={14} /> ก่อนหน้า
          </button>
          <button
            onClick={Next}
            disabled={currentPage === totalPages}
            className="px-3 py-1 flex items-center justify-center border-2 cursor-pointer border-primary rounded hover:bg-primary duration-300 transition-all hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ถัดไป <ArrowRight size={14} />
          </button>
        </div>
      </div>
      {/* ✅ Mobile Card View */}
      <div className="md:hidden space-y-3">
        {currentItems.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-text ">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.jobTitle}</p>
                <p className="text-sm text-gray-400 mt-1">{item.date}</p>
              </div>
              <button className="bg-primary hover:bg-primary-hover rounded p-2">
                <Eye size={16} className="text-white" />
              </button>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-text">⏱ {item.sla}</span>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full font-medium ${getStatusClass(
                  item.status
                )}`}
              >
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="justify-between items-center mt-4 text-sm flex md:hidden">
        <p>
          หน้า {currentPage} จาก {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            onClick={Previous}
            disabled={currentPage === 1}
            className="px-3 py-1 flex items-center justify-center border-2 cursor-pointer border-primary rounded hover:bg-primary duration-300 transition-all hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={14} /> ก่อนหน้า
          </button>
          <button
            onClick={Next}
            disabled={currentPage === totalPages}
            className="px-3 py-1 flex items-center justify-center border-2 cursor-pointer border-primary rounded hover:bg-primary duration-300 transition-all hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ถัดไป <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewDashboard;
