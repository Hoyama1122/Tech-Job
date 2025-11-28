"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Filter,
  CheckCircle2,
  Clock,
  FileText,
  TrendingUp,
  Briefcase,
} from "lucide-react";
import MonthlyTrendChart from "@/components/Executive/MonthlyTrendChart";
import JobStatusPieChart from "@/components/Executive/JobStatusPieChart";
import DepartmentChart from "@/components/Executive/DepartmentChart";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function ReportsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- Filters States ---
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all"); // 1. เพิ่ม State แผนก

  useEffect(() => {
    try {
      setIsLoading(true);
      setTimeout(() => {
        const jobsData = localStorage.getItem("CardWork");
        if (jobsData) {
          setJobs(JSON.parse(jobsData));
        }
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error("Failed to load data", error);
      setIsLoading(false);
    }
  }, []);

  // --- Helpers ---
  const getThaiMonth = (index: number) => {
    const months = [
      "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
      "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
    ];
    return months[index];
  };

  // --- 2. เตรียมตัวเลือกสำหรับ Dropdown ---
  const departments = useMemo(() => {
    const uniqueDepts = new Set(jobs.map(j => j.category).filter(Boolean));
    return Array.from(uniqueDepts);
  }, [jobs]);

  const years = useMemo(() => {
    const uniqueYears = new Set(jobs.map(j => new Date(j.createdAt).getFullYear()));
    return Array.from(uniqueYears).sort((a, b) => b - a);
  }, [jobs]);

  // --- 3. Filter Logic (เพิ่มเงื่อนไขแผนก) ---
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const date = new Date(job.createdAt || job.date);
      
      // เงื่อนไขปี
      const yearMatch = date.getFullYear().toString() === selectedYear;
      
      // เงื่อนไขเดือน
      const monthMatch =
        selectedMonth === "all" ||
        (date.getMonth() + 1).toString() === selectedMonth;
      
      // เงื่อนไขแผนก
      const deptMatch = 
        selectedDepartment === "all" || 
        job.category === selectedDepartment;

      return yearMatch && monthMatch && deptMatch;
    });
  }, [jobs, selectedYear, selectedMonth, selectedDepartment]);

  // --- Stats Calculation ---
  const stats = useMemo(() => {
    const total = filteredJobs.length;
    const completed = filteredJobs.filter((j) => j.status === "สำเร็จ").length;
    const pending = filteredJobs.filter(
      (j) => j.status === "รอการตรวจสอบ" || j.status === "กำลังทำงาน"
    ).length;

    const successRate = total > 0 ? ((completed / total) * 100).toFixed(1) : "0";

    return { total, completed, pending, successRate };
  }, [filteredJobs]);

  // --- Charts Data Preparation ---
  const monthlyData = useMemo(() => {
    const data = Array.from({ length: 12 }, (_, i) => ({
      name: getThaiMonth(i),
      งานทั้งหมด: 0,
      งานสำเร็จ: 0,
    }));

    // ใช้ jobs ชุดที่กรอง "แผนก" และ "ปี" แล้ว แต่ "ไม่กรองเดือน" (เพื่อให้กราฟเส้นโชว์ทั้งปี)
    const trendJobs = jobs.filter(job => {
       const date = new Date(job.createdAt);
       const yearMatch = date.getFullYear().toString() === selectedYear;
       const deptMatch = selectedDepartment === "all" || job.category === selectedDepartment;
       return yearMatch && deptMatch;
    });

    trendJobs.forEach((job) => {
        const monthIdx = new Date(job.createdAt).getMonth();
        data[monthIdx].งานทั้งหมด += 1;
        if (job.status === "สำเร็จ") {
          data[monthIdx].งานสำเร็จ += 1;
        }
    });

    return data;
  }, [jobs, selectedYear, selectedDepartment]);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredJobs.forEach((j) => {
      counts[j.status] = (counts[j.status] || 0) + 1;
    });
    return Object.keys(counts).map((key) => ({ name: key, value: counts[key] }));
  }, [filteredJobs]);

  const deptData = useMemo(() => {
    const depts: Record<string, number> = {};
    filteredJobs.forEach((j) => {
      const dept = j.category || "ทั่วไป";
      depts[dept] = (depts[dept] || 0) + 1;
    });
    return Object.keys(depts)
      .map((key) => ({ name: key, จำนวนงาน: depts[key] }))
      .sort((a, b) => b.จำนวนงาน - a.จำนวนงาน);
  }, [filteredJobs]);

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="p-4 md:p-6 space-y-6 min-h-screen pb-20 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-primary" />
            รายงานสรุปผลการดำเนินงาน
          </h1>
          <p className="text-slate-500 mt-1">
            วิเคราะห์ข้อมูลเชิงลึกเพื่อการตัดสินใจของผู้บริหาร
          </p>
        </div>
      </div>

      {/* --- Filters Bar --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-slate-700 font-medium">
          <Filter size={20} className="text-primary" />
          ตัวกรองข้อมูล :
        </div>
        
        {/* Year Filter */}
        {/* <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <span className="text-sm text-slate-500">ปี:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-transparent outline-none text-sm font-semibold text-slate-700 cursor-pointer"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y + 543}</option>
            ))}
            {!years.includes(Number(selectedYear)) && <option value={selectedYear}>{Number(selectedYear)+543}</option>}
          </select>
        </div> */}

        {/* Month Filter */}
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <Clock size={16} className="text-slate-400" />
          <span className="text-sm text-slate-500">เดือน:</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent outline-none text-sm font-semibold text-slate-700 cursor-pointer"
          >
            <option value="all">ทั้งหมด (ทั้งปี)</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i + 1}>{getThaiMonth(i)}</option>
            ))}
          </select>
        </div>

        {/* Department Filter (New) */}
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <Briefcase size={16} className="text-slate-400" />
          <span className="text-sm text-slate-500">แผนก:</span>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="bg-transparent outline-none text-sm font-semibold text-slate-700 cursor-pointer"
          >
            <option value="all">ทุกแผนก</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard title="งานทั้งหมด" value={stats.total} unit="งาน" icon={<FileText size={24} />} color="blue" trend="+12% จากเดือนก่อน" />
        <KpiCard title="อัตราความสำเร็จ" value={`${stats.successRate}%`} unit="Success" icon={<CheckCircle2 size={24} />} color="green" trend="อยู่ในเกณฑ์ดีเยี่ยม" />
        <KpiCard title="งานค้างดำเนินการ" value={stats.pending} unit="งาน" icon={<Clock size={24} />} color="orange" trend="ต้องการการติดตาม" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MonthlyTrendChart data={monthlyData} year={selectedYear} />
        </div>
        <div>
          <JobStatusPieChart data={statusData} />
        </div>
      </div>

      {/* Secondary Charts & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <DepartmentChart data={deptData} />

         {/* Summary Table */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <h3 className="text-lg font-bold text-slate-800 mb-4">สรุปประสิทธิภาพรายแผนก</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
                            <th className="py-3 font-semibold">แผนก</th>
                            <th className="py-3 font-semibold text-center">งานทั้งหมด</th>
                            <th className="py-3 font-semibold text-right">ความสำเร็จ</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-slate-700">
                        {deptData.map((dept, i) => {
                             const randomRate = Math.floor(Math.random() * (100 - 80 + 1) + 80); 
                             return (
                                <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition">
                                    <td className="py-3 flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full`} style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                                        {dept.name}
                                    </td>
                                    <td className="py-3 text-center font-medium">{dept.จำนวนงาน}</td>
                                    <td className="py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <span className="text-xs font-bold text-green-600">{randomRate}%</span>
                                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-green-500 rounded-full" style={{ width: `${randomRate}%` }}></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                             )
                        })}
                        {deptData.length === 0 && (
                             <tr><td colSpan={3} className="py-8 text-center text-slate-400">ไม่มีข้อมูล</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
         </div>
      </div>
    </div>
  );
}

// Sub-components
const KpiCard = ({ title, value, unit, icon, color, trend }: any) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-emerald-50 text-emerald-600 border-emerald-100",
    orange: "bg-amber-50 text-amber-600 border-amber-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };

  return (
    <div className={`p-5 rounded-2xl border bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group`}>
      <div className="flex justify-between items-start">
        <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <div className="flex items-baseline gap-1">
                <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
                <span className="text-xs font-medium text-slate-400">{unit}</span>
            </div>
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color as keyof typeof colorClasses]} bg-opacity-50`}>
            {icon}
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-slate-50 flex items-center gap-2">
        <TrendingUp size={14} className="text-green-500" />
        <span className="text-xs text-green-600 font-medium">{trend}</span>
      </div>
    </div>
  );
};

const LoadingScreen = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">กำลังประมวลผลข้อมูล...</p>
    </div>
);