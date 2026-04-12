"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";

// Fix for default marker icon in Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LeafletMapInnerProps {
  onLocationSelect?: (pos: { lat: number; lng: number }) => void;
  initialPos?: { lat: number; lng: number } | null;
  height?: string;
  zoom?: number;
}

function MapEvents({ onLocationSelect, setMarkerPos }: { 
  onLocationSelect?: (pos: { lat: number; lng: number }) => void,
  setMarkerPos: (pos: [number, number]) => void 
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setMarkerPos([lat, lng]);
      if (onLocationSelect) {
        onLocationSelect({ lat, lng });
      }
    },
  });
  return null;
}

export default function LeafletMapInner({
  onLocationSelect,
  initialPos,
  height = "250px",
  zoom = 13
}: LeafletMapInnerProps) {
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(
    initialPos ? [initialPos.lat, initialPos.lng] : null
  );

  const defaultCenter: [number, number] = [13.855, 100.585];

  return (
    <div style={{ width: "100%", height, borderRadius: "8px", overflow: "hidden" }}>
      <MapContainer
        center={markerPos || defaultCenter}
        zoom={zoom}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents onLocationSelect={onLocationSelect} setMarkerPos={setMarkerPos} />
        {markerPos && <Marker position={markerPos} />}
      </MapContainer>
    </div>
  );
}
