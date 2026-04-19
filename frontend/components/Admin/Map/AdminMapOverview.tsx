"use client";

import React, { useEffect, useState, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getSocket } from "@/lib/socket";
import { useAuthStore } from "@/store/useAuthStore";
import { TechnicianLocation, JobLocation } from "@/types/tracking";
import { trackingService } from "@/services/tracking.service";
import { jobService } from "@/services/job.service";

// Sub-components
import { StatusCounter } from "./StatusCounter";
import { TechnicianSidebar } from "./TechnicianSidebar";
import { ProfileModal } from "./ProfileModal";
import { MapLegend } from "./MapLegend";
import { MapLeaflet } from "./MapLeaflet";

const TECH_ICON_ONLINE = L.divIcon({
  className: "custom-div-icon",
  html: `<div class="relative">
          <div class="w-10 h-10 bg-primary rounded-full border-2 border-white shadow-md flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 24 24" fill="none" class="w-6 h-6 text-white" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div class="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
        </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

export default function AdminMapOverview() {
  const { user } = useAuthStore();
  const [techLocations, setTechLocations] = useState<
    Record<number, TechnicianLocation>
  >({});
  const [jobs, setJobs] = useState<JobLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedProfile, setSelectedProfile] =
    useState<TechnicianLocation | null>(null);

  const OFFLINE_THRESHOLD_MINUTES = 10;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [techs, jobData] = await Promise.all([
          trackingService.getTechnicianLocations(),
          jobService.getJobs(),
        ]);

        const techMap: Record<number, TechnicianLocation> = {};
        techs.forEach((t: TechnicianLocation) => {
          techMap[t.userId] = { ...t, online: isTechOnline(t.updatedAt) };
        });

        setTechLocations(techMap);
        setJobs(jobData.jobs || []);
      } catch (err) {
        console.error(" Error fetching map data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    if (user) {
      const socket = getSocket();
      if (socket) {
        socket.on(
          "technician:location:broadcast",
          (data: TechnicianLocation) => {
            setTechLocations((prev) => ({
              ...prev,
              [data.userId]: {
                ...(prev[data.userId] || {}),
                ...data,
              },
            }));
          },
        );
      }

      return () => {
        if (socket) {
          socket.off("technician:location:broadcast");
        }
      };
    }
  }, [user]);

  const isTechOnline = (updatedAt: string) => {
    const lastUpdate = new Date(updatedAt).getTime();
    const now = Date.now();
    return now - lastUpdate < OFFLINE_THRESHOLD_MINUTES * 60 * 1000;
  };

  const techList = useMemo(() => Object.values(techLocations), [techLocations]);
  const onlineCount = techList.filter(
    (t) => t.online !== false && isTechOnline(t.updatedAt),
  ).length;

  const groupedTechs = useMemo(() => {
    const groups: Record<string, TechnicianLocation[]> = {};
    techList.forEach((tech) => {
      if (
        tech.latitude &&
        tech.longitude &&
        tech.online !== false &&
        isTechOnline(tech.updatedAt)
      ) {
        const key = `${Number(tech.latitude).toFixed(6)},${Number(tech.longitude).toFixed(6)}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(tech);
      }
    });
    return Object.values(groups);
  }, [techList]);

  const getGroupIcon = (count: number) => {
    if (count <= 1) return TECH_ICON_ONLINE;
    return L.divIcon({
      className: "custom-div-icon",
      html: `<div class="relative">
              <div class="w-10 h-10 bg-primary rounded-full border-2 border-white shadow-md flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 24 24" fill="none" class="w-6 h-6 text-white" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div class="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
                <span class="text-[10px] text-white font-black">${count}</span>
              </div>
            </div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-[600px] bg-white rounded-lg border border-gray-100 shadow-sm transition-all duration-300">
        <div className="w-10 h-10 border-2 border-gray-100 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 text-sm font-bold uppercase">
          กำลังเชื่อมต่อข้อมูลแผนที่...
        </p>
      </div>
    );

  return (
    <div className="space-y-4">
      <StatusCounter jobs={jobs} onlineCount={onlineCount} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 h-[600px] bg-white rounded-xl shadow-sm border border-gray-100 p-2">
          <div className="h-full w-full rounded-lg overflow-hidden border border-gray-100 relative">
            <MapLeaflet
              jobs={jobs}
              groupedTechs={groupedTechs}
              getGroupIcon={getGroupIcon}
              onSelectTech={setSelectedProfile}
            />
            <MapLegend />
          </div>
        </div>

        <TechnicianSidebar
          techList={techList}
          onlineCount={onlineCount}
          isTechOnline={isTechOnline}
          onSelectTech={setSelectedProfile}
        />
      </div>

      <ProfileModal
        tech={selectedProfile}
        onClose={() => setSelectedProfile(null)}
        isTechOnline={isTechOnline}
      />
    </div>
  );
}
