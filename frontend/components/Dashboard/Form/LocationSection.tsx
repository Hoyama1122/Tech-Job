import React from "react";
import { MapPin } from "lucide-react";
import Map from "../Map/Map";

interface LocationSectionProps {
  onLocationSelect: (pos: { lat: number; lng: number }) => void;
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
      <div className="flex">
        <Map
          onLocationSelect={(pos) => {
            setLoc(pos);
            setValue("location", pos, { shouldValidate: true });
          }}
        />
      </div>
    </div>
  );
};

export default LocationSection;
