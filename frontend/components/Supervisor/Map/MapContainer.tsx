"use client";

import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import { CircleCheck, Loader2, Phone, User } from "lucide-react";

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "12px",
};

// 📍 icon marker ตามสถานะ
const getIconByStatus = (status: string) => {
  let iconUrl = "/marker/gray.svg";
  if (status === "กำลังทำงาน") iconUrl = "/marker/yellow.svg";
  else if (status === "รอการดำเนินงาน") iconUrl = "/marker/orange.svg";
  else if (status === "รอการตรวจสอบ") iconUrl = "/marker/blue.svg";
  else if (status === "สำเร็จ") iconUrl = "/marker/emerald.svg";
  else if (status === "ตีกลับ") iconUrl = "/marker/red.svg";

  return {
    url: iconUrl,
    scaledSize: new google.maps.Size(38, 38),
    anchor: new google.maps.Point(19, 38),
  };
};

const TeamMap = ({ jobs, users }: { jobs: any[]; users: any[] }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [members, setMembers] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);

  useEffect(() => {
    if (jobs && users) {
      const jobsWithTechnician = jobs.map((job) => {
        // หาช่างทุกคนที่อยู่ใน technicianId
        const technicians = Array.isArray(job.technicianId)
          ? users.filter(
              (u) => u.role === "technician" && job.technicianId.includes(u.id)
            )
          : [];

        return {
          ...job,
          technicians,
          technicianName: technicians[0]?.name ?? "ไม่ระบุ",
          technicianPhone: technicians[0]?.phone ?? "ไม่มีข้อมูล",
          lat: job.loc?.lat ?? null,
          lng: job.loc?.lng ?? null,
        };
      });

      setMembers(jobsWithTechnician);
    }
  }, [jobs, users]);

  const handleMarkerClick = (member: any) => {
    setSelectedMember(member);
  };
console.log(jobs);

  if (!isLoaded)
    return (
      <div className="flex items-center justify-center w-full h-[400px] bg-gray-50 rounded-lg">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="ml-3 text-sm text-gray-600">กำลังโหลดแผนที่...</p>
      </div>
    );

  return (
    <div className="rounded-lg overflow-hidden shadow-md">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: 13.855, lng: 100.585 }}
        zoom={13.3}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {/* แสดง Marker ทุกงาน */}
        {members.map((m: any) => {
          if (!m.lat || !m.lng) return null;

          return (
            <Marker
              key={m.id}
              position={{ lat: m.lat, lng: m.lng }}
              icon={getIconByStatus(m.status)}
              onClick={() => handleMarkerClick(m)}
              title={m.title}
            />
          );
        })}

        {/* InfoWindow เมื่อคลิก Marker */}
        {selectedMember && (
          <InfoWindow
            position={{
              lat: selectedMember.lat,
              lng: selectedMember.lng,
            }}
            onCloseClick={() => setSelectedMember(null)}
          >
            <div className="text-sm font-sarabun">
              <strong className="text-base">{selectedMember.title}</strong>
              <br />
              <span className="text-gray-600 text-xs">
                {selectedMember.description}
              </span>

              {/* สถานะ */}
              <div
                className={`mt-1 flex items-center gap-2 ${
                  selectedMember.status === "สำเร็จ"
                    ? "text-emerald-700"
                    : selectedMember.status === "ตีกลับ"
                    ? "text-red-700"
                    : selectedMember.status === "รอการตรวจสอบ"
                    ? "text-blue-700"
                    : selectedMember.status === "กำลังทำงาน"
                    ? "text-yellow-700"
                    : selectedMember.status === "รอการดำเนินงาน"
                    ? "text-orange-700"
                    : "text-gray-500"
                } font-semibold`}
              >
                <CircleCheck size={16} /> สถานะใบงาน: {selectedMember.status}
              </div>

              {/* ทีมงาน */}
              <div className="mt-2 text-xs font-medium">ทีมงาน:</div>
              {selectedMember.technicians?.length > 0 ? (
                <ul className="text-xs text-gray-700 mt-1">
                  {selectedMember.technicians.map((t) => (
                    <li key={t.id}>
                      • {t.name} ({t.phone})
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-xs text-gray-500">ไม่พบช่าง</div>
              )}

              {/* ปุ่มนำทาง */}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedMember.lat},${selectedMember.lng}`}
                target="_blank"
                className="block mt-2 text-blue-600 underline text-xs"
              >
                🔗 เปิดนำทางด้วย Google Maps
              </a>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default TeamMap;
