"use client";
import React, { useEffect, useMemo, useState } from "react";
import { UserCog, Users, Building } from "lucide-react";

const OrganizationPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      setIsLoading(true);
      const usersData = localStorage.getItem("Users");
      if (usersData) {
        setUsers(JSON.parse(usersData));
      }
    } catch (error) {
      console.error("Failed to load user data from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const teams = useMemo(() => {
    if (users.length === 0) return [];

    const supervisors = users.filter((u: any) => u.role === "supervisor");
    const technicians = users.filter((u: any) => u.role === "technician");

    return supervisors.map((supervisor: any) => {
      const teamMembers = technicians.filter(
        (tech: any) => tech.department === supervisor.department
      );
      return {
        supervisor,
        technicians: teamMembers,
      };
    });
  }, [users]);

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
          <Building size={30} />
          โครงสร้างองค์กร
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          ภาพรวมทีมและบุคลากรในแต่ละแผนก
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map(({ supervisor, technicians }) => (
          <div key={supervisor.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-5 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                <UserCog size={20} /> {supervisor.name}
              </h2>
              <p className="text-sm text-gray-600">แผนก: {supervisor.department}</p>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><Users size={18}/> ทีมช่าง ({technicians.length} คน)</h3>
              <ul className="space-y-2 text-sm text-gray-800 max-h-48 overflow-y-auto pr-2">
                {technicians.length > 0 ? technicians.map((tech: any) => (
                  <li key={tech.id} className="p-2 bg-blue-50/50 rounded-md">{tech.name}</li>
                )) : <p className="text-gray-400">ไม่มีช่างในแผนกนี้</p>}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrganizationPage;

