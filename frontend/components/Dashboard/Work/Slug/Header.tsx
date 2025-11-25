import {
  FileText,
  Download,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Edit,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { generateWorkPDF } from "@/lib/pdf/generateWorkPDF";

export default function Header({ job, pdfRef, onApprove, onReject, setShowEditModal }: any) {
  const router = useRouter();

  const handleDownload = async () => {
    if (!pdfRef?.current) return;
    await generateWorkPDF(pdfRef.current, "ใบงานช่าง_" + job.JobId);
  };

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Back + Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-primary/10 transition"
        >
          <ArrowLeft className="w-6 h-6 text-primary" />
        </button>

        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-primary">รายละเอียดใบงาน</h1>
            <p className="text-sm text-gray-500">
              หมายเลขงาน: <span className="font-medium">#{job.JobId}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3">
        <button
         onClick={() => setShowEditModal(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover
            text-white py-2 px-4 rounded-lg text-sm cursor-pointer transition font-semibold"
        >
          <Edit className="w-4 h-4" />
          แก้ไขงาน
        </button>
        <button
          onClick={onReject}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700
            text-white py-2 px-4 rounded-lg text-sm cursor-pointer transition font-semibold"
        >
          <XCircle className="w-4 h-4" />
          ตีกลับงาน
        </button>

        <button
          onClick={onApprove}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600
            text-white py-2 px-4 rounded-lg text-sm cursor-pointer transition font-semibold"
        >
          <CheckCircle className="w-4 h-4" />
          อนุมัติงานสำเร็จ
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 
          text-primary py-2 px-4 rounded-lg text-sm font-medium transition"
        >
          <Download className="w-4 h-4" />
          ดาวน์โหลด PDF
        </button>
      </div>
    </div>
  );
}
