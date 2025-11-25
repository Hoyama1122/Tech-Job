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
  height: "400px",
  borderRadius: "12px",
};

// 📍 icon marker ตามสถานะ
const getIconByStatus = (status: string) => {
  let iconUrl = "/marker/gray.svg";
  if (status === "กำลังทำงาน") iconUrl = "/marker/red.svg";
  else if (status === "ว่าง") iconUrl = "/marker/green.svg";
  else if (status === "รอการตรวจสอบ") iconUrl = "/marker/yellow.svg";
  else if (status === "สำเร็จ") iconUrl = "/marker/blue.svg";
  else if (status === "ตีกลับ") iconUrl = "/marker/purple.svg";

  return {
    url: iconUrl,
    scaledSize: new google.maps.Size(38, 38),
    anchor: new google.maps.Point(19, 38),
  };
};

const TeamMap = () => {
const TeamMap = ({ jobs, users }: { jobs: any[], users: any[] }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [members, setMembers] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);

  useEffect(() => {
    if (jobs && users) {
      const jobsWithTechnician = jobs.map(job => {
        // สมมติว่างานแต่ละงานมี technicianId แค่คนเดียวใน InfoWindow
        const mainTechnicianId = job.technicianId?.[0];
        const technician = users.find(u => u.id === mainTechnicianId);

        return {
          ...job,
          technicianName: technician ? technician.name : "ไม่ระบุ",
          technicianPhone: technician ? technician.phone : "ไม่มีข้อมูล",
        };
      });
      setMembers(jobsWithTechnician);
    }
  }, [jobs, users]);

  const handleMarkerClick = (member: any) => {
    setSelectedMember(member);
  };


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
        {/* 🧭 แสดง Marker ทุกใบงาน */}
        {members.map((m: any) => {
          const lat = m.loc?.lat ?? m.lat;
          const lng = m.loc?.lng ?? m.lng;
          if (!lat || !lng) return null;

          return (
            <Marker
              key={m.id}
              position={{ lat, lng }}
              icon={getIconByStatus(m.status)}
              onClick={() => setSelectedMember(m)}
              onClick={() => handleMarkerClick(m)}
              title={m.title}
            />
          );
        })}

        {/* 💬 InfoWindow เมื่อกด Marker */}
        {selectedMember && (
          <InfoWindow
            position={{
              lat: selectedMember.loc?.lat ?? selectedMember.lat,
              lng: selectedMember.loc?.lng ?? selectedMember.lng,
            }}
            onCloseClick={() => setSelectedMember(null)}
          >
            <div className="text-sm font-sarabun">
              <strong className="text-base">{selectedMember.title}</strong>
              <br />
              <span className="text-gray-600 text-xs">
                {selectedMember.description}
              </span>
              <br />
              <span
                className={` mt-1 flex  items-center gap-2 ${
                  selectedMember.status === "สำเร็จ"
                    ? "text-blue-500"
                    : selectedMember.status === "ตีกลับ"
                    ? "text-purple-500"
                    : selectedMember.status === "รอการตรวจสอบ"
                    ? "text-yellow-500"
                    : selectedMember.status === "กำลังทำงาน"
                    ? "text-red-500"
                    : "text-gray-500"
                } font-semibold`}
              >
                <CircleCheck size={16} /> สถานะใบงาน: {selectedMember.status}
              </span>

              <div className="mt-2 flex items-center  border-t pt-1 text-xs text-gray-700 gap-2">
                <User size={16} className="text-accent" />{" "}
                <strong>{selectedMember.technicianName}</strong>
              </div>
              <div className="mt-2 flex items-center pt-1 text-xs text-gray-700 gap-2">
                <Phone size={16} className="text-accent" />{" "}
                {selectedMember.technicianPhone}
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${
                  selectedMember.loc?.lat ?? selectedMember.lat
                },${selectedMember.loc?.lng ?? selectedMember.lng}`}
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
