// MainExecutive.jsx
"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { ClipboardList, Users, CheckCircle, Clock } from 'lucide-react';
import Summary from '@/components/Dashboard/Summary/Summary';
import DepartmentPerformanceChart from '@/components/Executive/DepartmentPerformanceChart';
import JobStatusPieChart from '@/components/Executive/JobStatusPieChart';

export default function MainExecutive() {
  const [card, setCard] = useState([]); 
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
        setIsLoading(true);

        const cardData = localStorage.getItem("CardWork");
        const usersData = localStorage.getItem("Users");

        if (!cardData || !usersData) {
            console.warn("ไม่พบข้อมูลใน LocalStorage");
            setCard([]);
            setUsers([]);
            return;
        }

        const parsedCardsData = JSON.parse(cardData);
        const parsedUsersData = JSON.parse(usersData);

        const allJobs = parsedCardsData; 

        setUsers(parsedUsersData);

        const joined = allJobs.map((job: any) => {
            const supervisor = parsedUsersData.find(
                (u: any) => u.role === "supervisor" && String(u.id) === String(job.supervisorId)
            );
            
            const technicians = parsedUsersData.filter(
                (u: any) => u.role === "technician" &&
                    Array.isArray(job.technicianId) &&
                    job.technicianId.some((tid: any) => String(tid) === String(u.id))
            );

            return {
                ...job,
                supervisor: supervisor || null,
                technicians: technicians || [],
            };
        });
        
        setCard(joined); 
    } catch (error) {
        console.error("โหลดข้อมูลล้มเหลว:", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  //  useMemo: เตรียมข้อมูลสำหรับกราฟแท่ง
  const departmentPerformance = useMemo(() => {
    const departmentCounts = card.reduce((acc, job: any) => {
      const department = job.category || 'ไม่ระบุ';
      acc[department] = (acc[department] || 0) + 1;
      return acc;
    }, {});

    console.log(departmentCounts);


    // แปลงเป็น Array สำหรับ Recharts 
    return Object.keys(departmentCounts).map(deptName => ({
        name: deptName,
        "จำนวนใบงาน" : departmentCounts[deptName],
    })).filter(item => item["จำนวนใบงาน"] > 0);
  }, [card]);

  // useMemo: เตรียมข้อมูลสำหรับแผนภูมิวงกลม 
  const statusProportion = useMemo(() => {
    const statusCounts = card.reduce((acc, job: any) => {
        const status = job.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    // แปลงเป็น Array สำหรับ Recharts
    return Object.keys(statusCounts).map(statusName => ({
        name: statusName,
        value: statusCounts[statusName], 
    }));
  }, [card]);

  // 4. Summary Card 
  const executiveSummary = useMemo(() => {
    const totalTechnicians = users.filter((u:any) => u.role === "technician").length;
    const completedJobs = card.filter((j: any) => j.status === "สำเร็จ").length;
    const inProgressJobs = card.filter((j: any) => j.status === "กำลังทำงาน" || j.status === "รอการตรวจสอบ").length;

    return [
      {
        type: "total_jobs",
        title: "ใบงานรวมทั้งหมด",
        value: card.length,
        icon: <ClipboardList className="w-8 h-8" />,
        bg: "bg-emerald-50",
        iconColor: "text-emerald-600",
      },
      {
        type: "completed_jobs",
        title: "งานที่เสร็จสิ้นแล้ว",
        value: completedJobs,
        icon: <CheckCircle className="w-8 h-8" />,
        bg: "bg-green-50",
        iconColor: "text-green-600",
      },
      {
        type: "in_progress_jobs",
        title: "งานที่ยังค้างอยู่",
        value: inProgressJobs,
        icon: <Clock className="w-8 h-8" />,
        bg: "bg-yellow-50",
        iconColor: "text-yellow-600",
      },
      {
        type: "technicians",
        title: "ช่างทั้งหมดในองค์กร",
        value: totalTechnicians,
        icon: <Users className="w-8 h-8" />,
        bg: "bg-blue-50",
        iconColor: "text-blue-600",
      },
    ];
  }, [card, users]);


  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className='p-4'>
        {/* Header */}
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>
            <div>
                <h1 className='text-3xl font-bold text-primary'>ภาพรวมสำหรับผู้บริหาร</h1>
                <p className='text-sm text-gray-500 mt-1' >แสดงประสิทธิภาพและสถานะงานขององค์กรทั้งหมด</p>
            </div>
        </div>
        
        {/* Summary Cards */}
        <Summary summary={executiveSummary} />
        
        <h2 className='text-2xl font-bold text-gray-800 mt-8 mb-4'>รายงานภาพรวมเชิงลึก</h2>

        {/* --- ส่วนแสดงกราฟ --- */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/*  กราฟแท่ง  */}
            <DepartmentPerformanceChart data={departmentPerformance} />
            
            {/*  แผนภูมิวงกลม */}
            <JobStatusPieChart data={statusProportion} />
        </div>
ฃ
        
    </div>
  );
}