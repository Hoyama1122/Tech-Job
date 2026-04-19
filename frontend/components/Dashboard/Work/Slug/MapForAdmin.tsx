"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const MapDetailInner = dynamic(
  () => import("@/components/ui/LeafletMapDetailInner"),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-6 w-full h-64 bg-gray-50 rounded-xl">
        <Loader2 size={26} className="animate-spin text-gray-600" />
      </div>
    )
  }
);

export default function MapForAdmin({ lat, lng }: { lat: any; lng: any }) {
  const handleDirection = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  const latitude = Number(lat);
  const longitude = Number(lng);

  if (!latitude || !longitude) {
    return (
      <div className="flex items-center justify-center py-6 w-full h-64 bg-gray-50 rounded-xl text-gray-400">
        ไม่มีตำแหน่งระบุในแผนที่
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 rounded-xl overflow-hidden shadow">
       <MapDetailInner lat={latitude} lng={longitude} onDirection={handleDirection} />
    </div>
  );
}
