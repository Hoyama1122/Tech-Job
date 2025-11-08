// components/Dashboard/Work/EmptyState.tsx
import { ClipboardList, CirclePlus } from "lucide-react";
import Link from "next/link";

export default function EmptyState() {
  return (
    <div className="md:col-span-2 lg:col-span-3 xl:col-span-4">
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ClipboardList className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">ไม่พบใบงาน</h3>
        <p className="text-gray-500 mb-6">ลองเปลี่ยนคำค้นหาหรือตัวกรองสถานะดู</p>
        <Link
          href="/admin/add-work"
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent/80 text-white font-semibold py-3 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          <CirclePlus className="w-5 h-5" />
          สร้างใบงานแรก
        </Link>
      </div>
    </div>
  );
}