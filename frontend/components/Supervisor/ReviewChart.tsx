// frontend/components/Supervisor/ReviewChart.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ClipboardList, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { jobService } from "@/services/job.service";
import { JobStatus, JobReportStatus } from "@/types/job";

// สีสำหรับกราฟ Pie
const COLORS = ["#22c55e", "#6366f1", "#f97316", "#ef4444", "#3b82f6"];

export default function ReviewCharts() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูล
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await jobService.getJobs();
        if (response && response.jobs) {
          setJobs(response.jobs);
        }
      } catch (error) {
        console.error("Load data error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // --- คำนวณข้อมูล ---

  // 1. ข้อมูลวันนี้ (Today)
  const todayStats = useMemo(() => {
    const today = new Date().toDateString();
    const todaysJobs = jobs.filter((j) => new Date(j.createdAt).toDateString() === today);

    return {
      total: todaysJobs.length,
      completed: todaysJobs.filter((j) => j.status === JobStatus.COMPLETED).length,
      pending: todaysJobs.filter((j) => j.reports && j.reports[0]?.status === JobReportStatus.SUBMITTED).length,
      working: todaysJobs.filter((j) => j.status === JobStatus.IN_PROGRESS).length,
    };
  }, [jobs]);

  // 2. ข้อมูลต่อเดือน (Monthly)
  const monthlyData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const months = [
      "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
      "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ];
    
    const data = months.map(m => ({ name: m, งานทั้งหมด: 0, สำเร็จ: 0 }));

    jobs.forEach((job) => {
      const date = new Date(job.createdAt);
      if (date.getFullYear() === currentYear) {
        const monthIdx = date.getMonth();
        data[monthIdx].งานทั้งหมด += 1;
        if (job.status === JobStatus.COMPLETED) {
          data[monthIdx].สำเร็จ += 1;
        }
      }
    });

    return data;
  }, [jobs]);

  // 3. สถานะงานรวม (Pie Chart)
  const statusData = useMemo(() => {
    const statusCount = {
      สำเร็จ: 0,
      รอตรวจสอบ: 0,
      กำลังทำ: 0,
      ตีกลับ: 0,
      รอมอบหมาย: 0
    };

    jobs.forEach(j => {
      const report = j.reports && j.reports[0];
      if (j.status === JobStatus.COMPLETED) statusCount.สำเร็จ++;
      else if (report?.status === JobReportStatus.SUBMITTED) statusCount.รอตรวจสอบ++;
      else if (j.status === JobStatus.IN_PROGRESS) statusCount.กำลังทำ++;
      else if (report?.status === JobReportStatus.REJECTED) statusCount.ตีกลับ++;
      else if (j.status === JobStatus.PENDING) statusCount.รอมอบหมาย++;
    });

    return [
      { name: "สำเร็จ", value: statusCount.สำเร็จ },
      { name: "รอตรวจสอบ", value: statusCount.รอตรวจสอบ },
      { name: "กำลังเดินการ", value: statusCount.กำลังทำ },
      { name: "ตีกลับแก้ไข", value: statusCount.ตีกลับ },
      { name: "รอดำเนินการ", value: statusCount.รอมอบหมาย },
    ].filter(i => i.value > 0);
  }, [jobs]);

  if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-6 mb-6">
      {/* 1. Cards สรุปวันนี้ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title="งานวันนี้ทั้งหมด" 
          value={todayStats.total} 
          icon={<ClipboardList size={24} />} 
          color="text-blue-600" 
          bg="bg-blue-50" 
        />
        <StatCard 
          title="รอตรวจสอบ (วันนี้)" 
          value={todayStats.pending} 
          icon={<Clock size={24} />} 
          color="text-indigo-600" 
          bg="bg-indigo-50" 
        />
        <StatCard 
          title="เดินการอยู่ (วันนี้)" 
          value={todayStats.working} 
          icon={<AlertCircle size={24} />} 
          color="text-orange-600" 
          bg="bg-orange-50" 
        />
        <StatCard 
          title="สำเร็จ (วันนี้)" 
          value={todayStats.completed} 
          icon={<CheckCircle size={24} />} 
          color="text-green-600" 
          bg="bg-green-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2. กราฟแท่ง รายเดือน */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">สถิติงานรายเดือน (ปี {new Date().getFullYear() + 543})</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" style={{ fontSize: '11px', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} style={{ fontSize: '11px' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="งานทั้งหมด" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={18} name="มอบหมายแล้ว" />
                <Bar dataKey="สำเร็จ" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={18} name="ปิดงานสำเร็จ" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. กราฟวงกลม สถานะรวม */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">สัดส่วนสถานะงานทั้งหมด</h3>
          <div className="h-[300px] flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="45%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component สำหรับ Card
function StatCard({ title, value, icon, color, bg }: any) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
      <div className={`p-4 rounded-2xl ${bg} ${color} flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider truncate">{title}</p>
        <p className="text-2xl font-black text-gray-900 leading-tight">{value}</p>
      </div>
    </div>
  );
}