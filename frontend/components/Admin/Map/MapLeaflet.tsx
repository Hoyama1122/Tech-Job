"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { User, Phone, Clock } from "lucide-react";
import { TechnicianLocation, JobLocation } from "@/types/tracking";
import { getJobIcon, getStatusColor } from "./mapUtils";
import { getStatusThai } from "@/types/job";

interface MapLeafletProps {
  jobs: JobLocation[];
  groupedTechs: TechnicianLocation[][];
  getGroupIcon: (count: number) => any;
  onSelectTech: (tech: TechnicianLocation) => void;
}

export const MapLeaflet = ({ jobs, groupedTechs, getGroupIcon, onSelectTech }: MapLeafletProps) => {
  return (
    <MapContainer center={[13.8, 100.6]} zoom={11} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Job Markers */}
      {jobs.map((job) => (
        <Marker
          key={`job-${job.id}`}
          position={[job.latitude, job.longitude]}
          icon={getJobIcon(job.status, job.reportStatus)}
        >
          <Popup className="custom-popup">
            <div className="p-1 min-w-[150px]">
              <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2 leading-tight text-lg">{job.title}</h3>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{job.description}</p>
              <div className="flex items-center gap-2 text-base font-bold">
                <span className={`px-2 py-0.5 rounded-full ${getStatusColor(job.status)}`}>
                  {getStatusThai(job.status)}
                </span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Grouped Technician Markers */}
      {groupedTechs.map((group) => {
        const representative = group[0];
        return (
          <React.Fragment key={`tech-group-container-${representative.userId}`}>
            <Marker
              position={[representative.latitude!, representative.longitude!]}
              icon={getGroupIcon(group.length)}
            >
              <Popup className="custom-popup-premium">
                <div className="min-w-[260px] max-h-[400px] overflow-y-auto custom-scrollbar p-1">
                  {group.map((tech, idx) => (
                    <div key={tech.userId} className={`${idx !== group.length - 1 ? 'border-b border-gray-100 mb-4 pb-4' : ''}`}>
                      <div className="flex items-center gap-3 mb-4">
                         <button 
                           onClick={() => onSelectTech(tech)}
                           className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white font-bold shadow-sm hover:scale-105 transition-transform"
                         >
                          {tech.avatar ? (
                            <img src={tech.avatar} alt="" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            tech.name?.charAt(0) || <User size={20} />
                          )}
                         </button>
                        <div className="flex-1 min-w-0">
                          <button 
                            onClick={() => onSelectTech(tech)}
                            className="font-bold text-gray-900 leading-tight text-base hover:text-primary transition-colors text-left truncate w-full"
                          >
                            {tech.name}
                          </button>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-black uppercase border border-primary/10 tracking-tight">{tech.role}</span>
                            {tech.departmentName && (
                              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded font-black uppercase tracking-tight">{tech.departmentName}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 px-1">
                        <div className="flex items-center gap-3">
                          <Phone size={18} className="text-gray-400" />
                          <span className="text-base">{tech.phone || "-"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock size={18} className="text-gray-400" />
                          <span className="text-base font-medium">อัปเดต: {new Date(tech.updatedAt).toLocaleTimeString()}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center px-1">
                        <span className="flex items-center gap-1.5 font-bold text-emerald-600 text-[10px] uppercase">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                          ออนไลน์
                        </span>
                        <button
                          onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${tech.latitude},${tech.longitude}`, "_blank")}
                          className="text-primary font-black text-sm hover:underline decoration-2 underline-offset-2"
                        >
                          ขอเส้นทาง
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        );
      })}
    </MapContainer>
  );
};
