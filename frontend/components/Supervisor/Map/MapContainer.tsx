"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const TeamMapInner = dynamic(
  () => import("./LeafletMapContainerInner"),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-[300px] bg-gray-50 rounded-lg">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="ml-3 text-sm text-gray-600">กำลังโหลดแผนที่...</p>
      </div>
    )
  }
);

const TeamMap = ({ jobs, users }: { jobs: any[]; users: any[] }) => {
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    if (jobs && users) {
      const jobsWithTechnician = jobs.map((job) => {
        // Handle coordinates from different possible formats
        let lat = job.latitude;
        let lng = job.longitude;

        // prioritize job.technicians if it exists (from new API)
        let technicians = job.technicians || [];
        
        // If it's empty but we have technicianId and users, try to find them (fallback)
        if (technicians.length === 0 && Array.isArray(job.technicianId) && users.length > 0) {
           technicians = users.filter(
              (u) => (u.role?.toLowerCase() === "technician" || u.role === "ช่าง") && job.technicianId.includes(u.id)
            );
        }

        return {
          ...job,
          technicians,
          lat: lat ? Number(lat) : null,
          lng: lng ? Number(lng) : null,
        };
      });

      setMembers(jobsWithTechnician);
    }
  }, [jobs, users]);

  return <TeamMapInner members={members} />;
};

export default TeamMap;
