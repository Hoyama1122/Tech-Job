"use client";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { Loader } from "lucide-react";

export default function MapLocation({ lat, lng }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  if (!isLoaded)
    return (
      <div className="flex items-center justify-center py-4">
        <Loader size={24} className="animate-spin text-gray-600" />
      </div>
    );

  const openDirection = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-3">
      <GoogleMap
        zoom={17}
        center={{ lat, lng }}
        mapContainerClassName="w-full h-64 rounded-xl shadow"
      >
        <Marker
          position={{ lat, lng }}
          animation={window.google.maps.Animation.DROP}
        />
      </GoogleMap>

      <button
        onClick={openDirection}
        className="w-full py-2 bg-primary text-white rounded-xl transition"
      >
        ดูเส้นทาง
      </button>
    </div>
  );
}
