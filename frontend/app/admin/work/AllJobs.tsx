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
  console.log(jobs);

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
      รอการตรวจสอบ: jobs.filter((j) => j.status?.trim() === "รอการตรวจสอบ")
        .length,
      รอการมอบหมายงาน: jobs.filter(
        (j) => j.status?.trim() === "รอการมอบหมายงาน"
      ).length,
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
