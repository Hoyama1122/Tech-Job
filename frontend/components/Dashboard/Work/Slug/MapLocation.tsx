"use client";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { Loader } from "lucide-react";

export default function MapLocation({ lat, lng }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  if (!isLoaded)
    return (
      <div>
        <Loader size={20} className=" animate-spin" />
      </div>
    );

  return (
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
  );
}
