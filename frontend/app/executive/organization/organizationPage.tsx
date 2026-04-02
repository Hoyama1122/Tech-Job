"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  UserCog,
  Users,
  Building,
  Search,
  Briefcase,
  User,
  BadgeCheck,
  Phone,
  Mail,
  MapPin
} from "lucide-react";

export default function OrganizationPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // โหลดข้อมูล
  useEffect(() => {
    try {
      setIsLoading(true);
      // จำลองการโหลดนิดหน่อย
      setTimeout(() => {
        const usersData = localStorage.getItem("Users");
        if (usersData) {
          setUsers(JSON.parse(usersData));
        }
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Failed to load user data", error);
      setIsLoading(false);
    }
  }, []);

  // --- Logic การกรองและจัดกลุ่ม ---

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return users.filter((u) =>
      u.name?.toLowerCase().includes(term) ||
      u.department?.toLowerCase().includes(term) ||
      u.role?.toLowerCase().includes(term) ||
      u.employeeCode?.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  // แยกกลุ่มตามตำแหน่ง
  const executives = filteredUsers.filter(u => ["executive", "ceo"].includes(u.role));
  const admins = filteredUsers.filter(u => u.role === "admin");
  const supervisors = filteredUsers.filter(u => u.role === "supervisor");
  const technicians = filteredUsers.filter(u => u.role === "technician");

  // จัดกลุ่มทีม (Supervisor + Technicians ในแผนกเดียวกัน)
  const teams = useMemo(() => {
    const depts = Array.from(new Set([
        ...supervisors.map(s => s.department),
        ...technicians.map(t => t.department)
    ])).filter(Boolean);

    return depts.map(dept => {
        return {
            name: dept,
            supervisor: supervisors.find(s => s.department === dept),
            members: technicians.filter(t => t.department === dept)
        };
    });
  }, [supervisors, technicians]);

  // สถิติภาพรวม
  const stats = [
    { 
        title: "พนักงานทั้งหมด", 
        value: users.length, 
        icon: <Users size={24} />, 
        bg: "bg-blue-50", 
        color: "text-blue-600" 
    },
    { 
        title: "ฝ่ายบริหาร/Admin", 
        value: users.filter(u => ["executive", "ceo", "admin"].includes(u.role)).length, 
        icon: <Briefcase size={24} />, 
        bg: "bg-purple-50", 
        color: "text-purple-600" 
    },
    { 
        title: "หัวหน้างาน", 
        value: users.filter(u => u.role === "supervisor").length, 
        icon: <UserCog size={24} />, 
        bg: "bg-orange-50", 
        color: "text-orange-600" 
    },
    { 
        title: "ช่างเทคนิค", 
        value: users.filter(u => u.role === "technician").length, 
        icon: <Building size={24} />, 
        bg: "bg-emerald-50", 
        color: "text-emerald-600" 
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p className="text-slate-500 animate-pulse">กำลังโหลดข้อมูลองค์กร...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-8 pb-20 font-sans">
      
      {/* --- Header & Search --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                <Building className="w-8 h-8 text-primary" />
                โครงสร้างองค์กร
            </h1>
            <p className="text-slate-500 mt-1">
                ข้อมูลบุคลากรและทีมงานทั้งหมดในระบบ
            </p>
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition shadow-sm"
                placeholder="ค้นหาชื่อ, ตำแหน่ง, หรือแผนก..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all duration-300">
                <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                    {stat.icon}
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                    <h4 className="text-2xl font-bold text-slate-800">{stat.value}</h4>
                </div>
            </div>
        ))}
      </div>

      {/* --- Executives & Admins Section --- */}
      {(executives.length > 0 || admins.length > 0) && (
        <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <BadgeCheck className="text-purple-600" />
                <h2 className="text-xl font-bold text-slate-800">ผู้บริหารและผู้ดูแลระบบ</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {executives.map(user => <UserCard key={user.id} user={user} type="exec" />)}
                {admins.map(user => <UserCard key={user.id} user={user} type="admin" />)}
            </div>
        </div>
      )}

      {/* --- Teams / Departments Section --- */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <Users className="text-orange-600" />
            <h2 className="text-xl font-bold text-slate-800">ทีมปฏิบัติงาน (แยกตามแผนก)</h2>
        </div>

        {teams.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {teams.map((team, idx) => (
                    <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-300">
                        {/* Team Header */}
                        <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <Building size={18} className="text-slate-500"/>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">{team.name}</h3>
                                    <p className="text-xs text-slate-500">สมาชิก {team.members.length + (team.supervisor ? 1 : 0)} คน</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 space-y-5 flex-1">
                            {/* Supervisor */}
                            {team.supervisor ? (
                                <div className="relative group">
                                    <div className="absolute -left-1 top-0 bottom-0 w-1 bg-orange-400 rounded-l-full"></div>
                                    <div className="pl-4">
                                        <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-2">หัวหน้างาน (Supervisor)</p>
                                        <UserCard user={team.supervisor} type="supervisor" />
                                    </div>
                                </div>
                            ) : (
                                <div className="p-3 text-center bg-slate-50 rounded-lg border border-dashed border-slate-300 text-slate-400 text-sm">
                                    ยังไม่มีหัวหน้างาน
                                </div>
                            )}

                            {/* Technicians */}
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 pl-4 border-l border-slate-200">
                                    ทีมช่าง ({team.members.length})
                                </p>
                                {team.members.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {team.members.map(tech => (
                                            <MiniUserCard key={tech.id} user={tech} />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400 italic pl-4">ไม่มีสมาชิกในทีม</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                <UserCog className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">ไม่พบข้อมูลทีมงาน</p>
            </div>
        )}
      </div>

    </div>
  );
}

// --- Sub-Components ---

// การ์ดสำหรับ User แบบเต็ม (ใช้กับ Exec, Admin, Supervisor)
const UserCard = ({ user, type }: { user: any, type: "exec" | "admin" | "supervisor" }) => {
    const styles = {
        exec: { bg: "bg-purple-50", border: "border-purple-100", text: "text-purple-700", badge: "bg-purple-100 text-purple-700" },
        admin: { bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-700", badge: "bg-blue-100 text-blue-700" },
        supervisor: { bg: "bg-white", border: "border-slate-200", text: "text-slate-700", badge: "bg-orange-100 text-orange-700" }
    };
    const s = styles[type];

    return (
        <div className={`p-4 rounded-xl border ${s.border} ${type === 'supervisor' ? 'shadow-sm' : 'shadow-sm bg-white'} flex items-start gap-3 transition-all hover:shadow-md`}>
            {/* Avatar */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-sm flex-shrink-0 
                ${type === 'exec' ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 
                  type === 'admin' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 
                  'bg-gradient-to-br from-orange-400 to-red-400'}`
            }>
                {user.name.charAt(0)}
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-800 truncate text-base">{user.name}</h4>
                </div>
                <p className="text-xs text-slate-500 mb-2 truncate">{user.role.toUpperCase()}</p>
                
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Phone size={12} className="text-slate-400"/> 
                        <span className="truncate">{user.phone || "-"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Mail size={12} className="text-slate-400"/> 
                        <span className="truncate max-w-[150px]">{user.email || "-"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// การ์ดขนาดเล็กสำหรับ Technician
const MiniUserCard = ({ user }: { user: any }) => (
    <div className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all cursor-default group">
        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0 group-hover:border-green-400 group-hover:text-green-600 transition-colors">
            {user.name.charAt(0)}
        </div>
        <div className="min-w-0 overflow-hidden">
            <p className="text-sm font-medium text-slate-700 truncate group-hover:text-primary transition-colors">{user.name}</p>
            <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                <Phone size={8}/> {user.phone}
            </p>
        </div>
    </div>
);