import { FileText } from "lucide-react";
import React, { useEffect, useState } from "react";
import Location from "./Location";
import Team from "./Team";

const JobsDetail = ({ job }) => {
  const [technicians, setTechnicians] = useState([]);
  useEffect(() => {
    const usersRaw = localStorage.getItem("Users");
    if (!usersRaw) return;

    const users = JSON.parse(usersRaw);

    const techUsers = users.filter((u) => u.role === "technician");

    // Find technicians assigned to the job
    const team = techUsers.filter((t) => job.technicianId?.includes(t.id));

    setTechnicians(team);
  }, [job]);
  console.log(technicians);
  return (
    <div>
      <div className="bg-white rounded-xl shadow-md p-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-gray-700" />
            รายละเอียดงาน
          </h2>

          <h2 className="text-base font-semibold text-gray-900 mb-2">
            ชื่องาน: {job.title}
          </h2>

          <div className="rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
              {job.description}
            </p>
          </div>
        </div>

        <Location job={job} />
        <Team job={job} technicians={technicians} />
      </div>
    </div>
  );
};

export default JobsDetail;
