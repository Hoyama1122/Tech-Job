"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CircleCheck, Phone, User } from "lucide-react";

// Helper for status icons
const getLeafletIcon = (status: string) => {
  let iconUrl = "/marker/gray.svg";
  if (status === "กำลังทำงาน") iconUrl = "/marker/yellow.svg";
  else if (status === "รอการดำเนินงาน") iconUrl = "/marker/orange.svg";
  else if (status === "รอการตรวจสอบ") iconUrl = "/marker/blue.svg";
  else if (status === "สำเร็จ") iconUrl = "/marker/green.svg";
  else if (status === "ตีกลับ") iconUrl = "/marker/red.svg";

  return L.icon({
    iconUrl,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
  });
};

const TeamMapInner = ({ members }: { members: any[] }) => {
  const defaultCenter: [number, number] = [13.855, 100.585];

  return (
    <div className="rounded-lg overflow-hidden shadow-md" style={{ height: "300px", width: "100%" }}>
      <MapContainer
        center={defaultCenter}
        zoom={12}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {members.map((m: any) => {
          if (!m.lat || !m.lng) return null;

          return (
            <Marker 
              key={m.id} 
              position={[m.lat, m.lng]} 
              icon={getLeafletIcon(m.status)}
            >
              <Popup>
                <div className="text-sm font-sans min-w-[200px]">
                  <strong className="text-base text-primary block mb-1">{m.title}</strong>
                  <span className="text-gray-600 text-xs block mb-2">
                    {m.description}
                  </span>

                  {/* Status */}
                  <div
                    className={`flex items-center gap-2 mb-2 ${
                      m.status === "สำเร็จ"
                        ? "text-emerald-700"
                        : m.status === "ตีกลับ"
                        ? "text-red-700"
                        : m.status === "รอการตรวจสอบ"
                        ? "text-blue-700"
                        : m.status === "กำลังทำงาน"
                        ? "text-yellow-700"
                        : m.status === "รอการดำเนินงาน"
                        ? "text-orange-700"
                        : "text-gray-500"
                    } font-semibold`}
                  >
                    <CircleCheck size={16} /> <span className="text-[11px]">สถานะ: {m.status}</span>
                  </div>

                  {/* Technicians */}
                  <div className="text-[11px] font-bold text-gray-800 border-t border-gray-100 pt-2 mb-1 uppercase tracking-tight">ช่างพื้นฐาน:</div>
                  {m.technicians?.length > 0 ? (
                    <ul className="text-[11px] text-gray-700 space-y-1">
                      {m.technicians.map((t: any) => (
                        <li key={t.id} className="flex items-center gap-1">
                          <User size={12} className="text-gray-400" />
                          {t.name} <span className="text-gray-400">({t.phone})</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-[11px] text-gray-500 italic">ไม่พบช่าง</div>
                  )}

                  {/* External Navigation */}
                  <div className="mt-3 border-t border-gray-100 pt-2">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent-hover text-[11px] font-bold flex items-center gap-1 no-underline"
                    >
                      🔗 เปิดนำทางด้วย Google Maps
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default TeamMapInner;
