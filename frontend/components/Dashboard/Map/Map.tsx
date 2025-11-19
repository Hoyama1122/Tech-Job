"use client";

import React, { useCallback, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Loader2 } from "lucide-react";

const containerStyle = {
  width: "80%",
  height: "250px",
  borderRadius: "4px",
};

const defaultCenter = {
  lat: 13.855,
  lng: 100.585,
};

export default function Map({
  onLocationSelect,
}: {
  onLocationSelect: (pos: { lat: number; lng: number }) => void;
}) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [markerPos, setMarkerPos] = useState<any>(null);


  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;

      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      const pos = { lat, lng };

      setMarkerPos(pos);

    
      if (onLocationSelect) {
        onLocationSelect(pos);
      }
    },
    [onLocationSelect]
  );
  console.log(markerPos);
  if (loadError)
    return <div>เกิดข้อผิดพลาดในการโหลดแผนที่</div>;

  if (!isLoaded)
    return (
      <div className="w-full h-[400px] bg-gray-100">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={markerPos || defaultCenter}
      zoom={13.3}
      onClick={handleMapClick}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    >
      {/* 🔥 Marker */}
      {markerPos && <Marker position={markerPos} />}
    </GoogleMap>
  );
}
