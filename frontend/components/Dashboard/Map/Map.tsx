"use client";
import React from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Loader2 } from "lucide-react";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px",
};

const center = {
  lat: 13.855,
  lng: 100.585,
};

const Map = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  if (loadError) return <div>เกิดข้อผิดพลาดในการโหลดแผนที่ </div>;
  if (!isLoaded) return (<div className="w-full h-[400px] bg-gray-100 flex items-center justify-center">
    <p className="text-center text-gray-500 justify-center flex gap-2" ><Loader2 className="animate-spin text-primary" size={40} /></p>
  </div>);

  return (  
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={13.3}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    ></GoogleMap>
  );
};

export default Map;
