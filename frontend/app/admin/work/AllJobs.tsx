// app/admin/work/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipboardList, Calendar } from "lucide-react";
import DateFormat from "@/lib/Format/DateFormat";
import SearchBar from "@/components/Dashboard/Work/SearchBar";
import StatsSummary from "@/components/Dashboard/Work/StatsSummary";
import LoadingSkeleton from "@/components/Dashboard/Work/LoadingSkeleton";
import EmptyState from "@/components/Dashboard/Work/EmptyState";
import JobCard from "@/components/Dashboard/Work/JobCard";

interface Job {
  id: string;
  JobId: string;
  title: string;
  description: string;
  status: string;
  supervisor?: { name: string };
  technician?: any[];
  date: string;
}

export default function Work() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ทั้งหมด");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 12;

  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;

  useEffect(() => {
    setIsLoading(true);
    try {
      const cardData = localStorage.getItem("CardWork");
      const userData = localStorage.getItem("Users"); //

      if (cardData) {
        const parsedCards = JSON.parse(cardData);
        const parsedUsers = userData ? JSON.parse(userData) : [];

        const joinedJobs = parsedCards.map((job: any) => {
          const supervisor = parsedUsers.find(
            (user: any) =>
              user.role === "supervisor" &&
              String(user.id) === String(job.supervisorId)
          );

          const jobDate = job.date || job.createdAt || job.dueDate || null;
          const formattedDate = jobDate
            ? new Date(jobDate).toLocaleString("th-TH", {
                dateStyle: "short",
                timeStyle: "short",
              })
            : "ไม่ระบุวันที่";

          return {
            ...job,
            supervisorName: supervisor
              ? { name: supervisor.name, department: supervisor.department }
              : { name: "ไม่ระบุ", department: "-" },
            formattedDate,
          };
        });

        setJobs(joinedJobs);
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการโหลดข้อมูล:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 400);
    }
  }, [setJobs]);

  const filteredJobs = useMemo(() => {
    if (!jobs.length) return [];

    return jobs.filter((job) => {
      const title = job.title?.toLowerCase() || "";
      const jobId = job.JobId?.toLowerCase() || "";
      const desc = job.description?.toLowerCase() || "";
      const status = job.status?.trim() || "";
      const searchTerm = search.toLowerCase().trim();

      const matchSearch =
        searchTerm === "" ||
        title.includes(searchTerm) ||
        jobId.includes(searchTerm) ||
        desc.includes(searchTerm);

      const matchStatus = filterStatus === "ทั้งหมด" || status === filterStatus;

      return matchSearch && matchStatus;
    });
  }, [jobs, search, filterStatus]);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  const stats = useMemo(
    () => ({
      รอการตรวจสอบ: jobs.filter((j) => j.status?.trim() === "รอการตรวจสอบ")
        .length,
      รอการดำเนินงาน: jobs.filter((j) => j.status?.trim() === "รอการดำเนินงาน")
        .length,
      กำลังทำงาน: jobs.filter((j) => j.status?.trim() === "กำลังทำงาน").length,
      สำเร็จ: jobs.filter((j) => j.status?.trim() === "สำเร็จ").length,
      ตีกลับ: jobs.filter((j) => j.status?.trim() === "ตีกลับ").length,
    }),
    [jobs]
  );

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
              <ClipboardList className="w-8 h-8" />
              ใบงานทั้งหมด
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              จัดการและติดตามใบงานทั้งระบบ
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 shadow-sm">
            <Calendar className="w-5 h-5 text-primary" />
            <DateFormat />
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <SearchBar
        search={search}
        setSearch={setSearch}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      {/* Stats Summary */}
      <StatsSummary stats={stats} />

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6">
        {isLoading ? (
          <LoadingSkeleton count={6} />
        ) : paginatedJobs.length === 0 ? (
          <EmptyState />
        ) : (
          paginatedJobs.map((job) => <JobCard key={job.JobId} job={job} />)
        )}
      </div>
      {/*  */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-primary cursor-pointer hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-white"
        >
          ก่อนหน้า
        </button>
        <span className="text-sm text-gray-600">
          หน้า {currentPage} / {totalPages || 1}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-4 py-2 bg-primary cursor-pointer hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-white"
        >
          ถัดไป
        </button>
      </div>
     
      
    </div>
  );
}
