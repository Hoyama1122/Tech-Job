"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix icon
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function MapDetailInner({ lat, lng, onDirection }: { lat: number, lng: number, onDirection: () => void }) {
  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} />
      </MapContainer>
      
      <button
        onClick={onDirection}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#29335c] text-white rounded-full shadow-lg z-[400]"
      >
        ดูเส้นทาง
      </button>
    </div>
  );
}
