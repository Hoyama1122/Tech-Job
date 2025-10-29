"use client";

import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Loader2 } from "lucide-react";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px",
};

//  icon marker
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
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [members, setMembers] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("CardWork");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMembers(parsed);
      } catch (err) {
        console.error(" Error parsing CardWork:", err);
      }
    }
  }, []);

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
        {/*  แสดง Marker ทุกใบงาน */}
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
              title={m.title}
            />
          );
        })}

        {/* ✅ แสดง InfoWindow เมื่อกด marker */}
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
                className={`${
                  selectedMember.status === "สำเร็จ"
                    ? "text-blue-500"
                    : selectedMember.status === "ตีกลับ"
                    ? "text-purple-500"
                    : selectedMember.status === "รอการตรวจสอบ"
                    ? "text-yellow-500"
                    : "text-red-500"
                } font-semibold`}
              >
                สถานะ: {selectedMember.status}
              </span>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${
                  selectedMember.loc?.lat ?? selectedMember.lat
                },${selectedMember.loc?.lng ?? selectedMember.lng}`}
                target="_blank"
                className="block mt-2 text-blue-600 underline text-xs"
              >
                🔗 เปิดนำทาง
              </a>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default TeamMap;
