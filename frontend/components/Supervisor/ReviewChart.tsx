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
import { CardWorkTypes } from "@/lib/Mock/Jobs";
import { ClipboardList, CheckCircle, Clock, AlertCircle } from "lucide-react";

// สีสำหรับกราฟ Pie
const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#FF0000"];

export default function ReviewCharts() {
  const [jobs, setJobs] = useState<CardWorkTypes[]>([]);
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูล
  useEffect(() => {
    try {
      const cardData = localStorage.getItem("CardWork");
      const authData = localStorage.getItem("auth-storage");
      
      if (cardData && authData) {
        const allJobs = JSON.parse(cardData);
        const auth = JSON.parse(authData);
        const supervisorId = auth.state?.userId;

        // กรองเฉพาะงานของ Supervisor คนนี้
        const myJobs = allJobs.filter((j: any) => String(j.supervisorId) === String(supervisorId));
        setJobs(myJobs);
      }
    } catch (error) {
      console.error("Load data error", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- คำนวณข้อมูล ---

  // 1. ข้อมูลวันนี้ (Today)
  const todayStats = useMemo(() => {
    const today = new Date().toDateString();
    const todaysJobs = jobs.filter((j) => new Date(j.createdAt).toDateString() === today);

    return {
      total: todaysJobs.length,
      completed: todaysJobs.filter((j) => j.status === "สำเร็จ").length,
      pending: todaysJobs.filter((j) => j.status === "รอการตรวจสอบ").length,
      working: todaysJobs.filter((j) => j.status === "กำลังทำงาน").length,
    };
  }, [jobs]);

  // 2. ข้อมูลต่อเดือน (Monthly) - นับจำนวนงานในแต่ละเดือนของปีปัจจุบัน
  const monthlyData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const months = [
      "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
      "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ];
    
    // สร้างโครงข้อมูลเริ่มต้น
    const data = months.map(m => ({ name: m, งานทั้งหมด: 0, สำเร็จ: 0 }));

    jobs.forEach((job) => {
      const date = new Date(job.createdAt);
      if (date.getFullYear() === currentYear) {
        const monthIdx = date.getMonth();
        data[monthIdx].งานทั้งหมด += 1;
        if (job.status === "สำเร็จ") {
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
      ตีกลับ: 0
    };

    jobs.forEach(j => {
      if (j.status === "สำเร็จ") statusCount.สำเร็จ++;
      else if (j.status === "รอการตรวจสอบ") statusCount.รอตรวจสอบ++;
      else if (j.status === "กำลังทำงาน") statusCount.กำลังทำ++;
      else if (j.status === "ตีกลับ") statusCount.ตีกลับ++;
    });

    return [
      { name: "สำเร็จ", value: statusCount.สำเร็จ },
      { name: "รอตรวจสอบ", value: statusCount.รอตรวจสอบ },
      { name: "กำลังทำ", value: statusCount.กำลังทำ },
      { name: "ตีกลับ", value: statusCount.ตีกลับ },
    ].filter(i => i.value > 0);
  }, [jobs]);

  if (loading) return <div className="p-4 text-center">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="space-y-6 mb-6">
      {/* 1. Cards สรุปวันนี้ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title="งานวันนี้ทั้งหมด" 
          value={todayStats.total} 
          icon={<ClipboardList size={24} />} 
          color="text-blue-600" 
          bg="bg-blue-100" 
        />
        <StatCard 
          title="รอตรวจสอบ (วันนี้)" 
          value={todayStats.pending} 
          icon={<Clock size={24} />} 
          color="text-yellow-600" 
          bg="bg-yellow-100" 
        />
        <StatCard 
          title="กำลังทำ (วันนี้)" 
          value={todayStats.working} 
          icon={<AlertCircle size={24} />} 
          color="text-orange-600" 
          bg="bg-orange-100" 
        />
        <StatCard 
          title="สำเร็จ (วันนี้)" 
          value={todayStats.completed} 
          icon={<CheckCircle size={24} />} 
          color="text-green-600" 
          bg="bg-green-100" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2. กราฟแท่ง รายเดือน */}
        <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow-md">
          <h3 className="text-lg font-bold text-gray-700 mb-4">สถิติงานรายเดือน (ปี {new Date().getFullYear() + 543})</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" style={{ fontSize: '12px' }} />
                <YAxis allowDecimals={false} style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar dataKey="งานทั้งหมด" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="สำเร็จ" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. กราฟวงกลม สถานะรวม */}
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h3 className="text-lg font-bold text-gray-700 mb-4">สัดส่วนสถานะงานทั้งหมด</h3>
          <div className="h-[300px] flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
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
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`p-3 rounded-full ${bg} ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}