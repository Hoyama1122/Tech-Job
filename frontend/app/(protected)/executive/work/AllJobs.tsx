// app/admin/work/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipboardList, Calendar } from "lucide-react";
import DateFormat from "@/lib/Format/DateFormat";

import StatsSummary from "@/components/Dashboard/Work/StatsSummary";
import LoadingSkeleton from "@/components/Dashboard/Work/LoadingSkeleton";
import EmptyState from "@/components/Dashboard/Work/EmptyState";

import SearchBar from "@/components/Supervisor/work/SearchBar";
import JobCard from "@/components/Executive/Work/JobCard";
import { jobService } from "@/services/job.service";

const statusMap: Record<string, string> = {
  "SUBMITTED":  "รอการตรวจสอบ",   // ✅
  "PENDING":    "รอดำเนินการ",     // ✅
  "IN_PROGRESS":"กำลังทำงาน",      // ✅
  "COMPLETED":  "สำเร็จ",          // ✅
  "APPROVED":   "สำเร็จ",          // ✅
  "REJECTED":   "ตีกลับ",          // ✅ เปลี่ยนจาก "ยกเลิก"
  "CANCELLED":  "ยกเลิก",          // คงไว้ถ้าต้องการแยก
};

export default function AllJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ทั้งหมด");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await jobService.getJobs();
        const rawJobs = res.jobs || [];

        const mappedJobs = rawJobs.map((job: any) => {
          const jobDate = job.createdAt || null;
          const formattedDate = jobDate
            ? new Date(jobDate).toLocaleString("th-TH", {
                dateStyle: "short",
                timeStyle: "short",
              })
            : "ไม่ระบุวันที่";

          return {
            ...job,
            status: statusMap[job.status] || job.status,
            formattedDate,
            supervisorName: job.supervisor || { name: "ไม่ระบุ", department: "-" }
          };
        });

        setJobs(mappedJobs);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการโหลดข้อมูล:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

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

 const stats = useMemo(
  () => ({
    "รอการตรวจสอบ": jobs.filter((j) => j.status?.trim() === "รอการตรวจสอบ").length,   // SUBMITTED
    "รอการดำเนินงาน": jobs.filter((j) => j.status?.trim() === "รอดำเนินการ").length,   // PENDING
    "กำลังทำงาน": jobs.filter((j) => j.status?.trim() === "กำลังทำงาน").length,        // IN_PROGRESS
    "สำเร็จ": jobs.filter((j) => j.status?.trim() === "สำเร็จ").length,                // COMPLETED / APPROVED
    "ตีกลับ": jobs.filter((j) => j.status?.trim() === "ยกเลิก").length,               // REJECTED / CANCELLED
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
        ) : filteredJobs.length === 0 ? (
          <EmptyState />
        ) : (
          filteredJobs.map((job) => <JobCard key={job.JobId} job={job} />)
        )}
      </div>

      {/* Results Count */}
      {!isLoading && filteredJobs.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          กำลังแสดง {filteredJobs.length} จาก {jobs.length} ใบงาน
        </div>
      )}
    </div>
  );
}
