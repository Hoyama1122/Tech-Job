import React from "react";
import {
  Activity,
  CheckCircle,
  Clock,
  UserPlus,
  AlertCircle,
  MoreHorizontal,
  File,
  ClipboardList,
  Users,
  Share,
} from "lucide-react";
import { ActivityLogs, LogIconMap } from "@/lib/Mock/Activity";
import Link from "next/link";
const Activities = ( ) => {
  return (
    <div className="flex flex-col space-y-4">
      {/* Latest Activities Card */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-primary flex items-center gap-2">
            <Activity className="w-5 h-5" />
            กิจกรรมล่าสุด
          </h3>
          <button className="text-accent hover:underline flex items-center gap-1">
            ดูทั้งหมด
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Activities List */}
        <div className="space-y-3 max-h-[575px] overflow-y-auto">
          {ActivityLogs.map((log) => {
            const Icon = LogIconMap[log.type].icon;
            const bg = LogIconMap[log.type].bg;
            const text = LogIconMap[log.type].text;
            return (
              <Link
                href={`/admin/work/${log.jobId}`}
                key={log.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-transparent hover:border-gray-200"
              >
                <div className={`flex-shrink-0 p-2 rounded-full ${bg}`}>
                  <Icon className={`w-4 h-4 ${text}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 font-medium line-clamp-2">
                    {log.detail}
                    {log.jobId && (
                      <span className="text-accent font-semibold ml-1">
                        {log.jobId}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {log.userName} — {log.role}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">
                      {new Date(log.timestamp).toLocaleString("th-TH")}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Empty State (when no activities) */}
        {false && (
          <div className="text-center py-8 text-gray-400">
            <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg">ยังไม่มีกิจกรรม</p>
            <p className="text-sm mt-2">
              กิจกรรมจะปรากฏที่นี่เมื่อมีการดำเนินการ
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions Card */}
    </div>
  );
};

export default Activities;
