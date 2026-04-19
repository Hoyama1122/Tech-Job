// frontend/components/Supervisor/ReviewDashboard.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { ArrowLeft, ArrowRight, Eye, Search, Filter, Calendar, User, MapPin } from "lucide-react";
import Link from "next/link";
import formatThaiDateTime from "@/lib/Format/DateFormatThai";
import { JobStatus, JobReportStatus, JobStatusThai, JobReportStatusThai, getStatusThai } from "@/types/job";
import { jobService } from "@/services/job.service";

const ReviewDashboard = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter States
  const [filterStatus, setFilterStatus] = useState("ทั้งหมด");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Load Data
  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await jobService.getJobs();
      if (response && response.jobs) {
        setJobs(response.jobs);
      }
    } catch (error) {
      console.error("Error loading review jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Filter Logic
  const filteredItems = useMemo(() => {
    return jobs.filter((job) => {
      // Get the display status
      const report = job.reports && job.reports.length > 0 ? job.reports[0] : null;
      const overallStatus = report ? report.status : job.status;

      // 1. Filter by Status
      const matchStatus = filterStatus === "ทั้งหมด" 
        ? true 
        : (overallStatus === filterStatus || getStatusThai(overallStatus) === filterStatus);

      // 2. Filter by Search (Job ID, Title, Technician Name)
      const searchLower = searchTerm.toLowerCase();
      const matchSearch = 
        String(job.id).includes(searchLower) ||
        job.title?.toLowerCase().includes(searchLower) ||
        job.location_name?.toLowerCase().includes(searchLower) ||
        (job.assignments && job.assignments.some((t: any) => t.fullname?.toLowerCase().includes(searchLower)));

      return matchStatus && matchSearch;
    });
  }, [jobs, filterStatus, searchTerm]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const getStatusClass = (status: string) => {
    const s = status?.toUpperCase();
    if (s === JobStatus.PENDING) return "bg-blue-100 text-blue-700 border-blue-200";
    if (s === JobReportStatus.SUBMITTED) return "bg-indigo-100 text-indigo-700 border-indigo-200";
    if (s === JobReportStatus.REJECTED) return "bg-orange-100 text-orange-700 border-orange-200";
    if (s === JobReportStatus.APPROVED || s === JobStatus.COMPLETED) return "bg-green-100 text-green-700 border-green-200";
    if (s === JobStatus.CANCELLED) return "bg-red-100 text-red-700 border-red-200";
    return "bg-gray-100 text-gray-700";
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
                className="w-full pl-10 pr-4 py-2 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
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
                className="px-4 py-2 border border-blue-100 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-auto"
            >
                <option value="ทั้งหมด">สถานะทั้งหมด</option>
                <optgroup label="สถานะงาน">
                  {Object.entries(JobStatusThai).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                  ))}
                </optgroup>
                <optgroup label="สถานะการส่งงาน">
                  {Object.entries(JobReportStatusThai).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                  ))}
                </optgroup>
            </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 uppercase font-semibold">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">ชื่องาน / สถานที่</th>
              <th className="px-4 py-3">ทีมงาน</th>
              <th className="px-4 py-3">อัปเดตเมื่อ</th>
              <th className="px-4 py-3 text-center">สถานะ</th>
              <th className="px-4 py-3 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentItems.length > 0 ? (
              currentItems.map((job) => {
                const report = job.reports && job.reports[0];
                const displayStatus = report ? report.status : job.status;
                
                return (
                  <tr key={job.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-primary">#{job.id}</td>
                    <td className="px-4 py-3 text-gray-800">
                      <div className="flex flex-col">
                        <span className="font-semibold truncate max-w-[200px]" title={job.title}>{job.title}</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin size={10} /> {job.location_name || 'ไม่ระบุสถานที่'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                            {job.assignments?.slice(0, 3).map((assign: any, i: number) => (
                                <div key={i} className="w-7 h-7 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] text-primary font-bold" title={assign.fullname}>
                                    {assign.fullname?.charAt(0)}
                                </div>
                            ))}
                        </div>
                        {job.assignments?.length > 3 && <span className="text-xs text-gray-500">+{job.assignments.length - 3}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {formatThaiDateTime(job.updatedAt)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusClass(displayStatus)}`}>
                        {getStatusThai(displayStatus)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link href={`/supervisor/work/${job.id}`}>
                          <button className="bg-primary hover:bg-primary-hover text-white p-2 rounded-lg transition-colors shadow-sm">
                          <Eye size={16} />
                          </button>
                      </Link>
                    </td>
                  </tr>
                );
              })
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
        {currentItems.map((job) => {
          const report = job.reports && job.reports[0];
          const displayStatus = report ? report.status : job.status;
          const assignedText = job.assignments ? job.assignments[0]?.fullname : 'ไม่ระบุ';

          return (
            <div key={job.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                  <div>
                      <span className="text-primary font-bold text-sm">#{job.id}</span>
                      <h3 className="font-semibold text-gray-900 mt-1 line-clamp-1">{job.title}</h3>
                  </div>
                  <Link href={`/supervisor/work/${job.id}`}>
                      <button className="bg-primary/10 text-primary p-2 rounded-full">
                          <Eye size={18} />
                      </button>
                  </Link>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <Calendar size={14} />
                  {formatThaiDateTime(job.updatedAt)}
              </div>

              <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User size={14} className="text-gray-400" />
                      <span>{assignedText} {job.assignments?.length > 1 && `+${job.assignments.length-1}`}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusClass(displayStatus)}`}>
                      {getStatusThai(displayStatus)}
                  </span>
              </div>
            </div>
          );
        })}
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
                    className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1 text-sm transition font-medium"
                >
                    <ArrowLeft size={14} /> ก่อนหน้า
                </button>
                <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 border border-primary text-primary rounded-lg hover:bg-blue-50 disabled:opacity-50 flex items-center gap-1 text-sm transition font-medium"
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