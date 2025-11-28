"use client";

import Activities from '@/components/Dashboard/Activities';
import CardWork from '@/components/Dashboard/CardWork';
import RenderModal from '@/components/Dashboard/Summary/RenderModal';
import Summary from '@/components/Dashboard/Summary/Summary';
import TeamMap from '@/components/Supervisor/Map/MapContainer';
import { ClipboardList, Clock, File, FileClock, Filter, MapPin, Users } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react'



export default function MainSupervisor() {
  const [card, setCard] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [detail, setDetail] = useState(null);
  const [supervisorsDepartment, setSupervisorsDepartment] = useState(null);


  useEffect(() => {
    try {
      setIsLoading(true);

      const cardData = localStorage.getItem("CardWork");
      const usersData = localStorage.getItem("Users");
      const auth = localStorage.getItem("auth-storage");

      if (!cardData || !usersData) {
        console.warn("ไม่พบข้อมูลใน loacalStorage")
        setCard([]);
        setUsers([]);
        return;
      }

      const parsedCardsData = JSON.parse(cardData);
      const parsedUsersData = JSON.parse(usersData);
      const parsedAuth = auth ? JSON.parse(auth) : []

      const currentSupervisor = parsedUsersData.find(
        (u: any) => String(u.id) === String(parsedAuth.state.userId)
      )

      if (currentSupervisor) {
        setSupervisorsDepartment(currentSupervisor.department);
      }

      const supervisorJobs = parsedCardsData.filter((job: any) =>
        String(job.supervisorId) === String(parsedAuth.state.userId)
      );

      setUsers(parsedUsersData);

      const joined = supervisorJobs.map((job: any) => {
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

  const filteredCard = useMemo(() => {
    return card.filter((job: any) => {
      const matchesStatus =
        statusFilter === "all" ? job.status !== "สำเร็จ" : job.status === statusFilter;

      const searchLower = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !searchTerm ||
        job.title.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.JobId.toLowerCase().includes(searchLower) ||
        job.technicians?.some((t: any) => t.name.toLowerCase().includes(searchLower));

      return matchesStatus && matchesSearch;

    });
  }, [card, statusFilter, searchTerm]);

  const summary = useMemo(() => {
    const departmentTechnicians = users.filter(
      (u: any) => u.role === "technician" && u.department === supervisorsDepartment
    ).length;


    const technicians = users.filter((u: any) => u.role === "technician").length;

    const waitingJobs = card.filter((j: any) => j.status === "รอการตรวจสอบ").length;

    const inProgressJobs = card.filter((j: any) => j.status === "กำลังทำงาน").length;

    const baseStats = [
      {
        type: "techniciansDepartment",
        title: "จำนวนช่างในแผนก ",
        value: departmentTechnicians,
        icon: <Users className="w-8 h-8" />,
        bg: "bg-blue-50",
        iconColor: "text-blue-600",
      },
      {
        type: "jobs_all",
        title: "จำนวนใบงานทั้งหมด",
        value: card.length,
        icon: <ClipboardList className="w-8 h-8" />,
        bg: "bg-emerald-50",
        iconColor: "text-emerald-600",
      },
      {
        type: "jobs_working",
        title: "จำนวนใบงานที่กำลังทำ",
        value: inProgressJobs,
        icon: <FileClock className="w-8 h-8" />,
        bg: "bg-amber-50",
        iconColor: "text-amber-600",
      },
      {
        type: "jobs_waiting",
        title: "ใบงานที่รอการตรวจสอบ",
        value: waitingJobs,
        icon: <Clock className="w-8 h-8" />,
        bg: "bg-orange-50",
        iconColor: "text-orange-600",
      },
    ]

    return baseStats;
  }, [users, card, filteredCard, searchTerm, statusFilter]);

  const itemPerPage = 6;
  const totalPages = Math.ceil(filteredCard.length / itemPerPage);
  const startIndex = (currentPage - 1) * itemPerPage;
  const endIndex = startIndex + itemPerPage;
  const paginatedCard = filteredCard.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const PaginationControls = () => (
    <div className='flex justify-center items-center gap-2 mt-4'>
      <button
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className='px-4 py-2 bg-gray-100 cursor-pointer hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors'
      >
        ก่อนหน้า
      </button>
      <span className='text-sm text-gray-600'>
        หน้า {currentPage} / {totalPages || 1}
      </span>
      <button
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages || totalPages === 0}
        className='px-4 py-2 bg-gray-100 cursor-pointer hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors'
      >
        ถัดไป
      </button>
    </div>
  );

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
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4'>
        <div>
          <h1 className='text-3xl font-bold text-primary'>หน้าหลัก</h1>
          <p className='text-sm text-text-secondary mt-1' >ระบบจัดการงานช่าง</p>
        </div>
      </div>

      {/* summary */}
      <Summary summary={summary} onSelect={(item: any) => setDetail(item)} />

      <RenderModal
        detail={detail}
        users={users}
        card={card}
        onClose={() => setDetail(null)}
      />
      {/* Main Content */}
      <div className='grid grid-cols-1 lg:grid-cols-[2.5fr_1fr] gap-4'>
        {/*  */}
        <div>
          <div className='bg-white/90 rounded-t-lg shadow-md p-4 '>
            <h1 className='text-base md:text-lg font-bold text-text  gap-2 flex items-center mb-2'>
              ใบงานล่าสุด <File size={20} />
            </h1>
            <div className='flex flex-col md:flex-row gap-4'>
              {/* Search */}
              <div className='flex-1 relative'>
                <input
                  type="text"
                  placeholder="ค้นหาด้วย หมายเลขงาน, ชื่องาน, ชื่อช่าง, หรือผู้รับผิดชอบ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>

              {/* Status Filter */}
              <div className='flex items-center gap-2'>
                <Filter className='w-5 h-5 text-gray-500' />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as "all")}
                  className='px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white'
                >
                  <option value="all">ทุกสถานะ</option>
                  <option value="สำเร็จ">สำเร็จ</option>
                  <option value="กำลังทำงาน">กำลังทำงาน</option>
                  <option value="รอการตรวจสอบ">รอการตรวจสอบ</option>
                  <option value="ตีกลับ">ตีกลับ</option>

                </select>
              </div>
            </div>

            {/* Active Filter Info */}
            <div className='mt-2 text-sm text-gray-600'>
              {searchTerm && <span> คำค้น: "{searchTerm}" </span>}
              {statusFilter !== "all" && <span> สถานะ: {statusFilter}</span>}
              {filteredCard.length > 0 && (
                <span className="ml-2">({filteredCard.length} รายการ)</span>
              )}
            </div>
          </div>
          <div className='bg-white/90 rounded-b-lg shadow-md px-4 pb-4'>
            {filteredCard.length === 0 ? (
              <div className='text-center py-8 text-gray-400'>
                <p className='text-lg'>ไม่พบข้อมูลที่ตรงกับการค้นหา</p>
                <p className='text-sm mt-2'>ลองเปลี่ยนคำค้นหาหรือตัวกรองดูนะ</p>
              </div>
            ) : (
              <>
                <CardWork card={paginatedCard} />
                <PaginationControls />
              </>
            )}
          </div>

        </div>
        
        {/* Right Bar */}
        <div>
          {/* Map */}
          <div className="bg-white/90 rounded-lg shadow-md p-4">
            <h1 className="text-base md:text-lg font-bold text-text mb-4 flex items-center gap-2">
              <MapPin size={20} /> แผนที่ภาพรวม
            </h1>
            <TeamMap jobs={filteredCard} users={users} />
          </div>

            {/* log */}
          <div>
            {/* <Activities/> */}
          </div>
        </div>
      </div>


    </div>
  )
}