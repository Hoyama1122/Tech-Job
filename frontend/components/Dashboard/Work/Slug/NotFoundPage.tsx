import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFoundPage({ jobId }: any) {
  return (
    <div className="text-center py-20">
      <AlertCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />

      <h1 className="text-2xl font-bold mb-4">ไม่พบใบงาน</h1>

      <p className="text-gray-600 mb-6">
        หมายเลข <span className="font-mono text-primary">#{jobId}</span> ไม่มีในระบบ
      </p>

      <Link
        href="/admin/work"
        className="inline-flex items-center gap-2 bg-primary text-white py-3 px-6 rounded-lg shadow"
      >
        <ArrowLeft className="w-5 h-5" />
        กลับไปหน้ารายการใบงาน
      </Link>
    </div>
  );
}
