import { MapPin, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import MapLocation from "@/components/Technician/slug/MapLocation";

const Location = ({ job }) => {

  return (
    <div className="mt-4 ">
      {/* Location & Team */}
      <div className="space-y-4">
        <div className="">
          <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-green-500" />
            สถานที่
          </h3>
          <p className="text-gray-700 mb-2">
            {job.customer?.address || "ไม่ระบุสถานที่"}
          </p>
          <MapLocation lat={job.loc.lat} lng={job.loc.lng} />
        </div>
      </div>
    </div>
  );
};

export default Location;
