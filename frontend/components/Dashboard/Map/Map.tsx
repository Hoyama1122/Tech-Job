"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const LeafletMapInnerSource = dynamic(
  () => import("./LeafletMapInner"),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[250px] bg-gray-100 flex items-center justify-center rounded-lg">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    )
  }
);

export default function Map({
  onLocationSelect,
  initialPos,
  height,
  zoom
}: {
  onLocationSelect?: (pos: { lat: number; lng: number }) => void;
  initialPos?: { lat: number; lng: number } | null;
  height?: string;
  zoom?: number;
}) {
  return (
    <LeafletMapInnerSource 
      onLocationSelect={onLocationSelect} 
      initialPos={initialPos}
      height={height}
      zoom={zoom}
    />
  );
}
