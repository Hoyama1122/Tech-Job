import {
  Users,
  Edit,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  Zap,
  Snowflake,
  Droplets,
  Wifi,
  Layers,
} from "lucide-react";
import Link from "next/link";
import MapLocation from "./MapLocation";
const departmentIcons: Record<string, React.ReactNode> = {
  ไฟฟ้า: <Zap size={14} />,
  แอร์: <Snowflake size={14} />,
  ประปา: <Droplets size={14} />,
  ระบบสื่อสาร: <Wifi size={14} />,
  ทั่วไป: <Layers size={14} />,
};
export default function Sidebar({ job }: any) {
  const getDepartmentIcon = (department: string) => {
    return departmentIcons[department] || <Layers size={14} />;
  };
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          ผู้รับผิดชอบ
        </h3>

        {job.supervisor && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1 ">หัวหน้างาน</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                {job.supervisor.name?.charAt(0)}
              </div>
              <span className="font-medium">{job.supervisor.name}</span>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500 mb-2 border-b border-gray-200 pb-2">
          ช่างที่รับผิดชอบ ({job.technician.length} คน)
        </p>

        <div className="space-y-3">
          {job.technician.map((t: any) => (
            <div
              key={t.id}
              className="flex items-start gap-3 rounded-xl  bg-blue-100 p-4  shadow-sm"
            >
              {/* Avatar */}
              <div className="h-11 w-11 rounded-full bg-primary/80 flex items-center justify-center text-white font-semibold shadow">
                {t.name?.charAt(0)}
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col gap-1">
                {/* name + department */}
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900">{t.name}</p>

                  <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
                    {getDepartmentIcon(t.department)}
                    {t.department}
                  </span>
                </div>

                {/* contact */}
                <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-600">
                  <p className="flex items-center gap-1">
                    <Phone size={14} className="text-primary" />
                    {t.phone}
                  </p>

                  <p className="flex items-center gap-1">
                    <Mail size={14} className="text-primary" />
                    {t.email}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md p-4">
          {/* Map */}
           <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
             <MapLocation lat={job.loc.lat} lng={job.loc.lng} />
          </div>
        </div>
    </div>
  );
}
