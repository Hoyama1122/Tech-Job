"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const MapDetailInner = dynamic(
  () => import("@/components/ui/LeafletMapDetailInner"),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-4 w-full h-64 bg-gray-50 rounded-xl">
        <Loader2 size={24} className="animate-spin text-gray-600" />
      </div>
    )
  }
);

export default function MapLocation({ lat, lng }: { lat: any; lng: any }) {
  const latitude = Number(lat);
  const longitude = Number(lng);

  const openDirection = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  if (!latitude || !longitude) {
    return (
      <div className="flex items-center justify-center py-4 w-full h-64 bg-gray-50 rounded-xl text-gray-400">
        ไม่มีตำแหน่งระบุในแผนที่
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="w-full h-64 rounded-xl overflow-hidden shadow">
        <MapDetailInner lat={latitude} lng={longitude} />
      </div>

      <button
        onClick={openDirection}
        className="w-full py-2 bg-primary text-white rounded-xl transition hover:bg-primary-hover active:scale-[0.98]"
      >
        ดูเส้นทาง
      </button>
    </div>
  );
}
