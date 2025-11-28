"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { ClipboardList, Users, CheckCircle, Clock, Filter } from 'lucide-react';
import Summary from '@/components/Dashboard/Summary/Summary';
import DepartmentPerformanceChart from '@/components/Executive/DepartmentPerformanceChart';
import JobStatusPieChart from '@/components/Executive/JobStatusPieChart';
import JobGrowthLineChart from '@/components/Executive/JobGrowthLineChart'; // Import component ใหม่

export default function MainExecutive() {
  const [card, setCard] = useState([]); 
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- State สำหรับตัวกรอง ---
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<string>(String(currentYear + 543)); // ปีหลัก (พ.ศ.)
  // const [compareYear, setCompareYear] = useState<string>("none"); // ปีที่ต้องการเปรียบเทียบ
  const [selectedMonth, setSelectedMonth] = useState<string>("all"); // เดือน

  const monthsTH = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

  useEffect(() => {
    try {
        setIsLoading(true);
        const cardData = localStorage.getItem("CardWork");
        const usersData = localStorage.getItem("Users");

        if (!cardData || !usersData) {
            setCard([]);
            setUsers([]);
            return;
        }

        const parsedCardsData = JSON.parse(cardData);
        const parsedUsersData = JSON.parse(usersData);
        setUsers(parsedUsersData);
        
        // Join Users data
        const joined = parsedCardsData.map((job: any) => {
            const supervisor = parsedUsersData.find((u: any) => String(u.id) === String(job.supervisorId));
            const technicians = parsedUsersData.filter((u: any) => 
                Array.isArray(job.technicianId) && job.technicianId.some((tid: any) => String(tid) === String(u.id))
            );
            return { ...job, supervisor, technicians };
        });
        
        setCard(joined); 
    } catch (error) {
        console.error("Load failed:", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  // --- Helper: แปลงปี ค.ศ. เป็น พ.ศ. ---
  const getThaiYear = (dateString: string) => {
      const d = new Date(dateString);
      return isNaN(d.getTime()) ? null : String(d.getFullYear() + 543);
  };

 
  const lineChartData = useMemo(() => {
    
    const data : any[] = monthsTH.map(m => ({ name: m, [selectedYear]: 0, }));

    card.forEach((job: any) => {
        const d = new Date(job.createdAt || job.date);
        const jobYear = String(d.getFullYear() + 543);
        const monthIndex = d.getMonth();

        // นับจำนวนงานใส่ในปีที่เลือก
        if (jobYear === selectedYear) {
          const currentValue = data[monthIndex][selectedYear] as number ;
            data[monthIndex][selectedYear] = (currentValue || 0) + 1;
        }
    });
    return data;
  }, [card, selectedYear]);

  const departmentPerformance = useMemo(() => {
    const deptMap: Record<string, any> = {};

    card.forEach((job: any) => {
        const d = new Date(job.createdAt || job.date);
        const jobYear = String(d.getFullYear() + 543);
        const jobMonth = String(d.getMonth() + 1); // 1-12
        const dept = job.category || 'ไม่ระบุ';


        const isMonthMatch = selectedMonth === "all" || jobMonth === selectedMonth;

        if (isMonthMatch) {
            if (!deptMap[dept]) deptMap[dept] = { name: dept, [selectedYear]: 0,};

            if (jobYear === selectedYear) {
                deptMap[dept][selectedYear] += 1;
            }
        }
    });

    // แปลง Object เป็น Array
    return Object.values(deptMap).filter(item => item[selectedYear] > 0 );
  }, [card, selectedYear, selectedMonth]);

  
  const statusProportion = useMemo(() => {
    const statusCounts: Record<string, number> = {};
    card.forEach((job: any) => {
        const jobYear = getThaiYear(job.createdAt || job.date);
        
        const d = new Date(job.createdAt || job.date);
        const jobMonth = String(d.getMonth() + 1);
        const isMonthMatch = selectedMonth === "all" || jobMonth === selectedMonth;

        if (jobYear === selectedYear && isMonthMatch) {
            statusCounts[job.status] = (statusCounts[job.status] || 0) + 1;
        }
    });
    return Object.keys(statusCounts).map(status => ({ name: status, value: statusCounts[status] }));
  }, [card, selectedYear, selectedMonth]);


  const executiveSummary = useMemo(() => {
    const filteredJobs = card.filter((j: any) => {
        const jobYear = getThaiYear(j.createdAt || j.date);
        const d = new Date(j.createdAt || j.date);
        const jobMonth = String(d.getMonth() + 1);
        const isMonthMatch = selectedMonth === "all" || jobMonth === selectedMonth;
        return jobYear === selectedYear && isMonthMatch;
    });

    const totalTechnicians = users.filter((u:any) => u.role === "technician").length;
    const completedJobs = filteredJobs.filter((j: any) => j.status === "สำเร็จ").length;
    const inProgressJobs = filteredJobs.filter((j: any) => j.status === "กำลังทำงาน" || j.status === "รอการตรวจสอบ").length;

    return [
      {
        type: "total_jobs",
        title: `งานทั้งหมด (${selectedYear})`,
        value: filteredJobs.length,
        icon: <ClipboardList className="w-8 h-8" />,
        bg: "bg-cyan-50",
        iconColor: "text-cyan-600",
      },
      {
        type: "completed_jobs",
        title: "งานที่เสร็จสิ้น",
        value: completedJobs,
        icon: <CheckCircle className="w-8 h-8" />,
        bg: "bg-green-50",
        iconColor: "text-green-600",
      },
      {
        type: "in_progress_jobs",
        title: "งานที่ค้างอยู่",
        value: inProgressJobs,
        icon: <Clock className="w-8 h-8" />,
        bg: "bg-yellow-50",
        iconColor: "text-yellow-600",
      },
      {
        type: "technicians",
        title: "ช่างทั้งหมด",
        value: totalTechnicians,
        icon: <Users className="w-8 h-8" />,
        bg: "bg-blue-50",
        iconColor: "text-blue-600",
      },
    ];
  }, [card, users, selectedYear, selectedMonth]);

  // รายการปีที่มีในข้อมูล
  const availableYears = useMemo(() => {
      const years = new Set(card.map((j: any) => getThaiYear(j.createdAt || j.date)).filter(Boolean));
      return Array.from(years).sort().reverse();
  }, [card]);

  if (isLoading) return <div className="p-4 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  return (
    <div className='p-4 space-y-6'>
        {/* Header & Filter */}
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
            <div>
                <h1 className='text-3xl font-bold text-primary'>Dashboard ผู้บริหาร</h1>
                <p className='text-sm text-gray-500'>ภาพรวมและสถิติประจำปี {selectedYear}</p>
            </div>
            
            {/* Filter Controls */}
            <div className="flex flex-wrap gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100">

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">เดือน:</span>
                    <select 
                        value={selectedMonth} 
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="border rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 ring-primary/20"
                    >
                        <option value="all">ทั้งหมด</option>
                        {monthsTH.map((m, i) => <option key={i} value={String(i + 1)}>{m}</option>)}
                    </select>
                </div>
            </div>
        </div>
        
        {/* Summary Cards */}
        <Summary summary={executiveSummary} onSelect={() => {}} />
        
        {/* Line Chart */}
        <JobGrowthLineChart 
            data={lineChartData} 
            years={ [selectedYear]} 
        />

        {/* Charts Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Modified Bar Chart */}
            <DepartmentPerformanceChart 
                data={departmentPerformance} 
                years={[selectedYear]}
            />
            
            {/* Pie Chart */}
            <JobStatusPieChart data={statusProportion}  />
        </div>
    </div>
  );
}