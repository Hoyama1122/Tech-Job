// frontend/components/Supervisor/ReviewDashboard.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { ArrowLeft, ArrowRight, Eye, Search, Filter, Calendar, User } from "lucide-react";
import Link from "next/link";
import formatThaiDateTime from "@/lib/Format/DateFormatThai";

const ReviewDashboard = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter States
  const [filterStatus, setFilterStatus] = useState("รอการตรวจสอบ");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Load Data
  useEffect(() => {
    setIsLoading(true);
    try {
      const cardData = localStorage.getItem("CardWork");
      const usersData = localStorage.getItem("Users");
      const auth = localStorage.getItem("auth-storage");

      if (cardData && usersData && auth) {
        const parsedJobs = JSON.parse(cardData);
        const parsedUsers = JSON.parse(usersData);
        const parsedAuth = JSON.parse(auth);
        const supervisorId = parsedAuth?.state?.userId;

        // ดึงเฉพาะงานที่ Supervisor คนนี้รับผิดชอบ
        const myJobs = parsedJobs.filter(
          (job: any) => String(job.supervisorId) === String(supervisorId)
        );

        // Map ข้อมูลช่างเข้ากับงาน
        const enrichedJobs = myJobs.map((job: any) => {
          const technicians = parsedUsers.filter((u: any) =>
            job.technicianId?.includes(u.id)
          );
          return { ...job, technicians };
        });

        // เรียงลำดับเอางานที่ส่งมาล่าสุดขึ้นก่อน (ดูจาก submittedAt หรือ completedAt)
        enrichedJobs.sort((a: any, b: any) => {
            const dateA = new Date(a.technicianReport?.submittedAt || a.updatedAt || a.createdAt).getTime();
            const dateB = new Date(b.technicianReport?.submittedAt || b.updatedAt || b.createdAt).getTime();
            return dateB - dateA;
        });

        setJobs(enrichedJobs);
      }
    } catch (error) {
      console.error("Error loading review jobs:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filter Logic
  const filteredItems = useMemo(() => {
    return jobs.filter((job) => {
      // 1. Filter by Status
      const matchStatus = filterStatus === "ทั้งหมด" ? true : job.status === filterStatus;

      // 2. Filter by Search (Job ID, Title, Technician Name)
      const searchLower = searchTerm.toLowerCase();
      const matchSearch = 
        job.JobId.toLowerCase().includes(searchLower) ||
        job.title.toLowerCase().includes(searchLower) ||
        job.technicians.some((t: any) => t.name.toLowerCase().includes(searchLower));

      return matchStatus && matchSearch;
    });
  }, [jobs, filterStatus, searchTerm]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "รอการตรวจสอบ": return "bg-blue-100 text-blue-700 border-blue-200";
      case "ตีกลับ": return "bg-red-100 text-red-700 border-red-200";
      case "สำเร็จ": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-md">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border border-gray-100">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        
        {/* Search */}
        <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input 
                type="text"
                placeholder="ค้นหาเลขงาน, ชื่องาน, ชื่อช่าง..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        {/* Filter Status */}
        <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
                value={filterStatus}
                onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-auto"
            >
                <option value="รอการตรวจสอบ">รอการตรวจสอบ (Default)</option>
                <option value="ทั้งหมด">ทั้งหมด</option>
                <option value="ตีกลับ">ตีกลับ</option>
                <option value="สำเร็จ">สำเร็จ</option>
            </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 uppercase font-semibold">
            <tr>
              <th className="px-4 py-3">เลขที่ใบงาน</th>
              <th className="px-4 py-3">ชื่องาน</th>
              <th className="px-4 py-3">ช่างผู้ปฏิบัติงาน</th>
              <th className="px-4 py-3">วันที่ส่งงาน</th>
              <th className="px-4 py-3 text-center">สถานะ</th>
              <th className="px-4 py-3 text-center">ตรวจสอบ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentItems.length > 0 ? (
              currentItems.map((job) => (
                <tr key={job.JobId} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-primary">{job.JobId}</td>
                  <td className="px-4 py-3 text-gray-800">
                    <div className="max-w-xs truncate" title={job.title}>
                        {job.title}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                            {job.technicians.slice(0, 3).map((tech: any, i: number) => (
                                <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border border-white flex items-center justify-center text-[10px] text-gray-600 font-bold" title={tech.name}>
                                    {tech.name.charAt(0)}
                                </div>
                            ))}
                        </div>
                        {job.technicians.length > 3 && <span className="text-xs text-gray-500">+{job.technicians.length - 3}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatThaiDateTime(job.technicianReport?.submittedAt || job.updatedAt || job.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusClass(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Link href={`/supervisor/work/${job.JobId}`}>
                        <button className="bg-primary hover:bg-primary-hover text-white p-2 rounded-lg transition-colors shadow-sm">
                        <Eye size={16} />
                        </button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  ไม่พบข้อมูลใบงาน
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {currentItems.map((job) => (
          <div key={job.JobId} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <span className="text-primary font-bold text-sm">{job.JobId}</span>
                    <h3 className="font-semibold text-gray-900 mt-1 line-clamp-1">{job.title}</h3>
                </div>
                <Link href={`/supervisor/work/${job.JobId}`}>
                    <button className="bg-primary/10 text-primary p-2 rounded-full">
                        <Eye size={18} />
                    </button>
                </Link>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <Calendar size={14} />
                {formatThaiDateTime(job.technicianReport?.submittedAt || job.createdAt)}
            </div>

            <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                <div className="flex items-center gap-2">
                    <User size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">{job.technicians[0]?.name || 'ไม่ระบุ'} {job.technicians.length > 1 && `+${job.technicians.length-1}`}</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusClass(job.status)}`}>
                    {job.status}
                </span>
            </div>
          </div>
        ))}
        {currentItems.length === 0 && (
            <div className="text-center py-10 text-gray-500">ไม่พบข้อมูล</div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">หน้า {currentPage} จาก {totalPages}</p>
            <div className="flex gap-2">
                <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1 text-sm transition"
                >
                    <ArrowLeft size={14} /> ก่อนหน้า
                </button>
                <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1 text-sm transition"
                >
                    ถัดไป <ArrowRight size={14} />
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default ReviewDashboard;