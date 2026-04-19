"use client";

import Activities from "@/components/Dashboard/Activities";
import CardWork from "@/components/Dashboard/CardWork";
import RenderModal from "@/components/Dashboard/Summary/RenderModal";
import Summary from "@/components/Dashboard/Summary/Summary";
import TeamMap from "@/components/Supervisor/Map/MapContainer";
import {
  ClipboardList,
  Clock,
  File,
  FileClock,
  Filter,
  MapPin,
  Users,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useJobStore } from "@/store/useJobStore";
import { useAuthStore } from "@/store/useAuthStore";
import { userService, UserItem } from "@/services/user.service";
import { JobStatus, JobStatusThai } from "@/types/job";

export default function MainSupervisor() {
  const card = useJobStore((state) =>
    Array.isArray(state.jobs) ? state.jobs : []
  );
  const storeLoading = useJobStore((state) => state.isLoading);
  const fetchJobs = useJobStore((state) => state.fetchJobs);
  const { user: authUser } = useAuthStore();

  const [users, setUsers] = useState<UserItem[]>([]);
  const [currentUser, setCurrentUser] = useState<UserItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [detail, setDetail] = useState<any>(null);

  // ================================
  // โหลดข้อมูล
  // ================================
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        await fetchJobs();

        const allUsers = await userService.getUsers();
        const safeUsers = Array.isArray(allUsers) ? allUsers : [];

        setUsers(safeUsers);

        if (authUser?.id) {
          const me = safeUsers.find((u) => u.id === authUser.id) ?? null;
          setCurrentUser(me);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("โหลดข้อมูลล้มเหลว:", error);
        setUsers([]);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchJobs, authUser?.id]);

  // ================================
  // Filter งาน
  // ================================
  const filteredCard = useMemo(() => {
    const safeCard = Array.isArray(card) ? card : [];

    return safeCard.filter((job: any) => {
      const jobStatus = String(job.status ?? "").toUpperCase();
      const filterStatus = String(statusFilter ?? "").toUpperCase();

      const matchesStatus =
        statusFilter === "all" ||
        jobStatus === filterStatus ||
        job.status === statusFilter;

      const searchLower = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !searchLower ||
        job.title?.toLowerCase().includes(searchLower) ||
        job.description?.toLowerCase().includes(searchLower) ||
        job.JobId?.toLowerCase().includes(searchLower) ||
        job.technicians?.some((t: any) =>
          t.name?.toLowerCase().includes(searchLower)
        );

      return matchesStatus && matchesSearch;
    });
  }, [card, statusFilter, searchTerm]);

  // ================================
  // Summary Dashboard
  // ================================
  const summary = useMemo(() => {
    const currentDeptId = currentUser?.department?.id;
    const safeUsers = Array.isArray(users) ? users : [];
    const safeCard = Array.isArray(card) ? card : [];

    const departmentTechnicians = safeUsers.filter(
      (u) => u.role === "TECHNICIAN" && u.department?.id === currentDeptId
    ).length;

    const waitingJobs = safeCard.filter((j: any) => {
      const s = String(j.status ?? "").toUpperCase();
      return s === "SUBMITTED" || s === "PENDING";
    }).length;

    const inProgressJobs = safeCard.filter(
      (j: any) => String(j.status ?? "").toUpperCase() === "IN_PROGRESS"
    ).length;

    return [
      {
        type: "techniciansDepartment",
        title: `ช่างในแผนก${
          currentUser?.department?.name
            ? ` (${currentUser.department.name})`
            : ""
        }`,
        value: departmentTechnicians,
        icon: <Users className="w-8 h-8" />,
        bg: "bg-blue-50",
        iconColor: "text-blue-600",
      },
      {
        type: "jobs_all",
        title: "ใบงานทั้งหมด",
        value: safeCard.length,
        icon: <ClipboardList className="w-8 h-8" />,
        bg: "bg-emerald-50",
        iconColor: "text-emerald-600",
      },
      {
        type: "jobs_working",
        title: "ใบงานที่กำลังทำ",
        value: inProgressJobs,
        icon: <FileClock className="w-8 h-8" />,
        bg: "bg-amber-50",
        iconColor: "text-amber-600",
      },
      {
        type: "jobs_waiting",
        title: "ใบงานที่รอตรวจสอบ",
        value: waitingJobs,
        icon: <Clock className="w-8 h-8" />,
        bg: "bg-orange-50",
        iconColor: "text-orange-600",
      },
    ];
  }, [users, card, currentUser]);

  // ================================
  // Pagination
  // ================================
  const itemPerPage = 6;
  const totalPages = Math.ceil(filteredCard.length / itemPerPage);
  const startIndex = (currentPage - 1) * itemPerPage;
  const paginatedCard = filteredCard.slice(
    startIndex,
    startIndex + itemPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const PaginationControls = () => (
    <div className="flex justify-center items-center gap-2 mt-4">
      <button
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded-lg"
      >
        ก่อนหน้า
      </button>
      <span className="text-sm text-gray-600">
        หน้า {currentPage} / {totalPages || 1}
      </span>
      <button
        onClick={() =>
          setCurrentPage((p) => Math.min(totalPages || 1, p + 1))
        }
        disabled={currentPage === totalPages || totalPages === 0}
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded-lg"
      >
        ถัดไป
      </button>
    </div>
  );

  // ================================
  // Loading
  // ================================
  if (isLoading || storeLoading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // ================================
  // UI
  // ================================
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-primary mb-4">หน้าหลัก</h1>

      <Summary summary={summary} onSelect={setDetail} />

      <RenderModal
        detail={detail}
        users={users}
        card={card}
        currentUser={currentUser}
        onClose={() => setDetail(null)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[2.5fr_1fr] gap-4">
        {/* LEFT */}
        <div>
          <div className="bg-white p-4 rounded-t-lg shadow">
            <h2 className="font-bold flex items-center gap-2 mb-2">
              ใบงานล่าสุด <File size={20} />
            </h2>

            <input
              type="text"
              placeholder="ค้นหา..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border p-2 rounded mb-2"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="all">ทุกสถานะ</option>
              {Object.values(JobStatus).map((status) => (
                <option key={status} value={status}>
                  {JobStatusThai[status as JobStatus]}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white p-4 rounded-b-lg shadow">
            {filteredCard.length === 0 ? (
              <p className="text-center text-gray-400">ไม่พบข้อมูล</p>
            ) : (
              <>
                <CardWork card={paginatedCard} />
                <PaginationControls />
              </>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-bold flex items-center gap-2 mb-2">
            <MapPin size={20} /> แผนที่
          </h2>
          <TeamMap jobs={filteredCard} users={users} />
        </div>
      </div>
    </div>
  );
}