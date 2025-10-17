"use client";

import React, { useState } from "react";
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


const members = [
  { id: 1, name: "ช่างเอ", lat: 13.855, lng: 100.585, status: "กำลังทำงาน" },
  { id: 2, name: "ช่างบี", lat: 13.845, lng: 100.59, status: "ว่าง" },
  { id: 3, name: "ช่างซี", lat: 13.841, lng: 100.598, status: "รอตรวจสอบ" },
];


const getIconByStatus = (status: string) => {
  let iconUrl = "/marker/gray.svg";
  if (status === "กำลังทำงาน") iconUrl = "/marker/red.svg";
  else if (status === "ว่าง") iconUrl = "/marker/green.svg";
  else if (status === "รอตรวจสอบ") iconUrl = "/marker/yellow.svg";

  return {
    url: iconUrl,
    scaledSize: new google.maps.Size(40, 40),
    anchor: new google.maps.Point(20, 40),
  };
};

const TeamMap = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [selectedMember, setSelectedMember] = useState<null | any>(null);
 
  if (!isLoaded)
    return (
      <div className="flex items-center justify-center w-full h-[400px] bg-gray-50 rounded-lg">
        <div className="flex flex-col items-center gap-3 text-text">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-medium">กำลังโหลดแผนที่...</p>
        </div>
      </div>
    );

  return (
    <div className="rounded-lg overflow-hidden shadow-md">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: 13.855, lng: 100.585 }}
        zoom={14}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {members.map((m) => (
          <Marker
            key={m.id}
            position={{ lat: m.lat, lng: m.lng }}
            icon={getIconByStatus(m.status)}
            onClick={() => setSelectedMember(m)}
          />
        ))}

        {selectedMember && (
          <InfoWindow
            position={{ lat: selectedMember.lat, lng: selectedMember.lng }}
            onCloseClick={() => setSelectedMember(null)}
          >
            <div className="text-sm leading-5 font-sarabun">
              <strong className="text-[15px]">{selectedMember.name}</strong>
              <br />
              สถานะ :{" "}
              <span
                className={`${
                  selectedMember.status === "กำลังทำงาน"
                    ? "text-red-500"
                    : selectedMember.status === "รอตรวจสอบ"
                    ? "text-yellow-500"
                    : "text-green-500"
                } font-semibold`}
              >
                {selectedMember.status}
              </span>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedMember.lat},${selectedMember.lng}`}
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
