import React from "react";
import { MapPin } from "lucide-react";
import Map from "../Map/Map";

interface LocationSectionProps {
  onLocationSelect: (pos: { lat: number; lng: number }) => void;
  loc: { lat: number; lng: number } | null;
  setLoc: (pos: { lat: number; lng: number }) => void;
  setValue: (
    name: string,
    value: any,
    options?: { shouldValidate: boolean }
  ) => void;
}

const LocationSection: React.FC<LocationSectionProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onLocationSelect,
  loc,
  setLoc,
  setValue,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="p-[12px] flex items-center justify-center mt-2">
          <MapPin className="w-6 h-6 text-green-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-80 mt-2">ตำแหน่งงาน</h2>
          <p className="text-sm text-gray-500">เลือกตำแหน่งในแผนที่</p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Map
          onLocationSelect={(pos) => {
            setLoc(pos);
            setValue("location", pos, { shouldValidate: true });
          }}
        />
        
        {/* Display Latitude and Longitude */}
        <div className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex-1">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block mb-1">Latitude</span>
            <div className="text-sm font-mono text-primary bg-white px-3 py-1.5 rounded border border-gray-200 shadow-sm">
              {loc?.lat?.toFixed(6) || "—"}
            </div>
          </div>
          <div className="flex-1">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block mb-1">Longitude</span>
            <div className="text-sm font-mono text-primary bg-white px-3 py-1.5 rounded border border-gray-200 shadow-sm">
              {loc?.lng?.toFixed(6) || "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSection;
