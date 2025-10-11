"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import React from "react";

// 📍 ตัวอย่างข้อมูล
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

  return new L.Icon({
    iconUrl,
    iconSize: [40, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -35],
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
};

const TeamMap = () => {
  return (
    <MapContainer
      center={[13.845, 100.59]}
      zoom={14}
      className="rounded-lg w-full h-[300px] md:h-[400px]"
      scrollWheelZoom={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {members.map((m) => (
        <Marker
          key={m.id}
          position={[m.lat, m.lng]}
          icon={getIconByStatus(m.status)}
        >
          <Popup className="">
            <strong className="text-[16px]">{m.name}</strong> <br />
            สถานะ :{" "}
            <span
              className={`${
                m.status === "กำลังทำงาน"
                  ? "text-red-500"
                  : m.status === "รอตรวจสอบ"
                  ? "text-yellow-500"
                  : "text-green-500"
              } font-semibold text-md`}
            >
              {m.status}
            </span>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default TeamMap;
