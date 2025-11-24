"use client";

import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { Loader } from "lucide-react";

export default function MapForAdmin({ lat, lng }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const handleDirection = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  if (!isLoaded)
    return (
      <div className="flex items-center justify-center py-6">
        <Loader size={26} className="animate-spin text-gray-600" />
      </div>
    );

  return (
    <div className="relative w-full h-64 rounded-xl overflow-hidden shadow">
  <GoogleMap
    zoom={17}
    center={{ lat, lng }}
    mapContainerClassName="w-full h-full"
  >
    <Marker
      position={{ lat, lng }}
      animation={google.maps.Animation.DROP}
    />
  </GoogleMap>

  <button
    onClick={handleDirection}
    className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 bg-primary text-white rounded-full shadow-lg z-20"
  >
    ดูเส้นทาง
  </button>
</div>

  );
}
