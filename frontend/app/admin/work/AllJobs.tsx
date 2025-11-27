// app/admin/work/page.tsx
"use client";

import { useEffect, useState } from "react";
import { ClipboardList, Calendar } from "lucide-react";
import DateFormat from "@/lib/Format/DateFormat";
import SearchBar from "@/components/Dashboard/Work/SearchBar";
import StatsSummary from "@/components/Dashboard/Work/StatsSummary";
import LoadingSkeleton from "@/components/Dashboard/Work/LoadingSkeleton";
import EmptyState from "@/components/Dashboard/Work/EmptyState";
import JobCard from "@/components/Dashboard/Work/JobCard";

export default function Work() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ทั้งหมด");
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setIsLoading(true);

    try {
      const cardData = JSON.parse(localStorage.getItem("CardWork") || "[]");
      const userData = JSON.parse(localStorage.getItem("Users") || "[]");

      const joined = cardData.map((job) => {
        const sp = userData.find(
          (u) =>
            u.role === "supervisor" && String(u.id) === String(job.supervisorId)
        );

        const dateSource = job.date || job.createdAt || job.dueDate || null;
        const formattedDate = dateSource
          ? new Date(dateSource).toLocaleString("th-TH", {
              dateStyle: "short",
              timeStyle: "short",
            })
          : "ไม่ระบุวันที่";

        return {
          ...job,
          supervisorName: sp
            ? { name: sp.name, department: sp.department }
            : { name: "ไม่ระบุ", department: "-" },
          formattedDate,
        };
      });

      setJobs(joined);
    } catch (e) {
      console.error("Error loading jobs:", e);
    }

    setTimeout(() => setIsLoading(false), 300);
  }, []);

  // Filter + Search
  const filteredJobs = jobs.filter((job) => {
    const searchTerm = search.toLowerCase().trim();

    const title = job.title?.toLowerCase() || "";
    const jobId = job.JobId?.toLowerCase() || "";
    const desc = job.description?.toLowerCase() || "";

    const matchSearch =
      searchTerm === "" ||
      title.includes(searchTerm) ||
      jobId.includes(searchTerm) ||
      desc.includes(searchTerm);

    const matchStatus =
      filterStatus === "ทั้งหมด" || job.status?.trim() === filterStatus;

    return matchSearch && matchStatus;
  });

  // Pagination
  const jobsPerPage = 12;
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterStatus]);

  // Stats summary
  const stats = {
    รอการตรวจสอบ: jobs.filter((j) => j.status?.trim() === "รอการตรวจสอบ")
      .length,
    รอการดำเนินงาน: jobs.filter((j) => j.status?.trim() === "รอการดำเนินงาน")
      .length,
    กำลังทำงาน: jobs.filter((j) => j.status?.trim() === "กำลังทำงาน").length,
    สำเร็จ: jobs.filter((j) => j.status?.trim() === "สำเร็จ").length,
    ตีกลับ: jobs.filter((j) => j.status?.trim() === "ตีกลับ").length,
  };

  return (
    <div className="p-4">
      {/* Header */}
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

          <div className="flex items-center gap-3  bg-white rounded-xl px-4 py-2 shadow-sm">
            <Calendar className="w-5 h-5 text-primary" />
            <DateFormat />
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <SearchBar
        search={search}
        setSearch={setSearch}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      {/* Stats Summary */}
      <StatsSummary stats={stats} />

      {/* Jobs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6">
        {isLoading ? (
          <LoadingSkeleton count={6} />
        ) : paginatedJobs.length === 0 ? (
          <EmptyState />
        ) : (
          paginatedJobs.map((job) => <JobCard key={job.JobId} job={job} />)
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
        >
          ก่อนหน้า
        </button>

        <span className="text-sm text-gray-600">
          หน้า {currentPage} / {totalPages || 1}
        </span>

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
}
