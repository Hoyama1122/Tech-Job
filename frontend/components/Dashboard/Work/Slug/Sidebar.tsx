import { Users, Edit, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function Sidebar({ job }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          ผู้รับผิดชอบ
        </h3>

        {job.supervisor && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1">หัวหน้างาน</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                {job.supervisor.name?.charAt(0)}
              </div>
              <span className="font-medium">{job.supervisor.name}</span>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500 mb-2">
          ช่างที่รับผิดชอบ ({job.technician.length} คน)
        </p>

        <div className="space-y-2">
          {job.technician.map((t: any) => (
            <div key={t.id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">
                {t.name?.charAt(0)}
              </div>
              <span>{t.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 space-y-3">
        <Link
          href={`/admin/work/${job.JobId}/edit`}
          className="flex items-center justify-center gap-2 bg-accent text-white py-3 rounded-lg shadow"
        >
          <Edit className="w-5 h-5" />
          แก้ไขใบงาน
        </Link>

        <button className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg shadow">
          <CheckCircle className="w-5 h-5" />
          อนุมัติงาน
        </button>

        <button className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-lg">
          <XCircle className="w-5 h-5" />
          ส่งกลับแก้ไข
        </button>
      </div>
    </div>
  );
}
