"use client";

import LoadingSkeleton from "@/components/Dashboard/Work/LoadingSkeleton";
import EmptyState from "@/components/Dashboard/Work/EmptyState";
import SearchBar from "@/components/Supervisor/work/SearchBar";
import StatsSummary from "@/components/Supervisor/work/StatsSum";
import DateFormat from "@/lib/Format/DateFormat";
import { Calendar, ClipboardList } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import JobWork from "@/components/Supervisor/work/JobWork";
import { jobService } from "@/services/job.service";

interface Job {
  id: string;
  JobId: string;
  title: string;
  description: string;
  status: string;
  technician?: any[];
  date: string;
  createdAt: string;
}

export default function Work() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);

      try {
        const res = await jobService.getJobs();
        const data = res.jobs || [];
        setJobs(data);
      } catch (error: any) {
        console.error(
          "โหลด job ไม่สำเร็จ:",
          error.response?.data || error.message
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    if (!jobs.length) return [];

    return jobs.filter((job) => {
      const title = job.title?.toLowerCase() || "";
      const jobId = job.JobId?.toLowerCase() || "";
      const desc = job.description?.toLowerCase() || "";
      const searchTerm = search.toLowerCase().trim();

      const matchSearch =
        searchTerm === "" ||
        title.includes(searchTerm) ||
        jobId.includes(searchTerm) ||
        desc.includes(searchTerm);

      const matchStatus =
        filterStatus === "ALL" || job.status === filterStatus;

      return matchSearch && matchStatus;
    });
  }, [jobs, search, filterStatus]);

const stats = useMemo(
  () => ({
    รอการตรวจสอบ: jobs.filter((j) => j.status === "SUBMITTED").length,
    รอการดำเนินงาน: jobs.filter((j) => j.status === "PENDING").length,
    กำลังทำงาน: jobs.filter((j) => j.status === "IN_PROGRESS").length,
    สำเร็จ: jobs.filter((j) => ["COMPLETED", "APPROVED"].includes(j.status)).length,
    ตีกลับ: jobs.filter((j) => ["REJECTED", "CANCELLED"].includes(j.status)).length,
  }),
  [jobs]
);

  return (
    <div className="p-4">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
              <ClipboardList className="w-8 h-8" />
              All Jobs
            </h1>
            <p className="text-sm text-gray-500 mt-1">Track all jobs in system</p>
          </div>

          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 shadow-sm">
            <Calendar className="w-5 h-5 text-primary" />
            <DateFormat />
          </div>
        </div>
      </div>

      <SearchBar
        search={search}
        setSearch={setSearch}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      <StatsSummary stats={stats} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6">
        {isLoading ? (
          <LoadingSkeleton count={6} />
        ) : filteredJobs.length === 0 ? (
          <EmptyState />
        ) : (
          filteredJobs.map((job) => <JobWork key={job.JobId} job={job} />)
        )}
      </div>

      {!isLoading && filteredJobs.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {filteredJobs.length} of {jobs.length} jobs
        </div>
      )}
    </div>
  );
}