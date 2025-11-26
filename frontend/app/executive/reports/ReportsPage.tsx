"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Download, Filter, Building, BarChart3 } from "lucide-react";

const ReportsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [departmentFilter, setDepartmentFilter] = useState("all");

  useEffect(() => {
    try {
      setIsLoading(true);
      const jobsData = localStorage.getItem("CardWork");
      if (jobsData) {
        setJobs(JSON.parse(jobsData));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const departments = useMemo(() => {
    if (jobs.length === 0) return [];
    const allDepartments = jobs.map((job: any) => job.category).filter(Boolean);
    return ["all", ...Array.from(new Set(allDepartments))];
  }, [jobs]);

  const performanceData = useMemo(() => {
    const dataToProcess =
      departmentFilter === "all"
        ? jobs
        : jobs.filter((job: any) => job.category === departmentFilter);

    const summary = dataToProcess.reduce((acc, job: any) => {
      const dept = job.category || "ไม่ระบุ";
      if (!acc[dept]) {
        acc[dept] = { total: 0, completed: 0, in_progress: 0 };
      }
      acc[dept].total += 1;
      if (job.status === "สำเร็จ") {
        acc[dept].completed += 1;
      } else if (job.status === "กำลังทำงาน" || job.status === "รอการตรวจสอบ") {
        acc[dept].in_progress += 1;
      }
      return acc;
    }, {});

    return Object.entries(summary).map(([name, stats]: [string, any]) => ({
      name,
      ...stats,
      completion_rate: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0,
    }));
  }, [jobs, departmentFilter]);

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
          <BarChart3 size={30} />
          รายงานและสถิติ
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          สรุปภาพรวมประสิทธิภาพการทำงานในแต่ละแผนก
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="font-semibold">ตัวกรอง:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === "all" ? "ทุกแผนก" : dept}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary btn-sm flex items-center gap-2">
            <Download size={16} />
            Export to CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-sm uppercase">
              <tr>
                <th className="p-4 font-bold">แผนก</th>
                <th className="p-4 font-bold text-center">งานทั้งหมด</th>
                <th className="p-4 font-bold text-center">งานที่กำลังทำ</th>
                <th className="p-4 font-bold text-center">งานที่สำเร็จ</th>
                <th className="p-4 font-bold text-center">% ความสำเร็จ</th>
              </tr>
            </thead>
            <tbody>
              {performanceData.map((data) => (
                <tr key={data.name} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-semibold text-primary">{data.name}</td>
                  <td className="p-4 text-center">{data.total}</td>
                  <td className="p-4 text-center text-amber-600">{data.in_progress}</td>
                  <td className="p-4 text-center text-green-600">{data.completed}</td>
                  <td className="p-4 text-center font-medium">{data.completion_rate.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;

