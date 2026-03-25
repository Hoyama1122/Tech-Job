import { FileText, Download, ArrowLeft, Edit, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { generateWorkPDF } from "@/lib/pdf/generateWorkPDF";

export default function Header({
  job,
  pdfRef,
  onApprove,
  onReject,
  setShowEditModal,
  setShowCancelModal,
  role,
}: any) {
  const router = useRouter();
  const myRole = role?.toLowerCase?.() || "";
  const status = job?.status?.toUpperCase?.() || "";

  const handleDownload = async () => {
    if (!pdfRef?.current) return;
    await generateWorkPDF(pdfRef.current, "ใบงานช่าง_" + job.JobId);
  };

  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="rounded-lg p-2 transition hover:bg-primary/10"
        >
          <ArrowLeft className="h-6 w-6 text-primary" />
        </button>

        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-primary">รายละเอียดใบงาน</h1>
            <p className="text-sm text-gray-500">
              หมายเลขงาน: <span className="font-medium">#{job?.JobId}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {myRole === "supervisor" && (
          <>
            <button
              disabled={status !== "PENDING"}
              className={`rounded-md px-4 py-2 text-white ${
                status === "PENDING"
                  ? "bg-red-600 hover:bg-red-700"
                  : "cursor-not-allowed bg-gray-300"
              }`}
              onClick={onReject}
            >
              ตีกลับงาน
            </button>

            <button
              disabled={status !== "PENDING"}
              className={`rounded-md px-4 py-2 text-white ${
                status === "PENDING"
                  ? "bg-green-600 hover:bg-green-700"
                  : "cursor-not-allowed bg-gray-300"
              }`}
              onClick={onApprove}
            >
              อนุมัติงาน
            </button>
          </>
        )}

        {myRole === "admin" && (
          <>
            <button
              onClick={() => setShowEditModal(true)}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover"
            >
              <Edit className="h-4 w-4" />
              แก้ไขงาน
            </button>

            <button
              disabled={status !== "PENDING"}
              className={`rounded-md px-4 py-2 text-white ${
                status === "PENDING"
                  ? "bg-red-500 hover:bg-red-600"
                  : "cursor-not-allowed bg-gray-300"
              }`}
              onClick={onReject}
            >
              ตีกลับงาน
            </button>

            <button
              disabled={status !== "PENDING"}
              className={`rounded-md px-4 py-2 text-white ${
                status === "PENDING"
                  ? "bg-green-600 hover:bg-green-700"
                  : "cursor-not-allowed bg-gray-300"
              }`}
              onClick={onApprove}
            >
              อนุมัติงาน
            </button>

            <button
              disabled={status !== "PENDING_ACTION"}
              onClick={() => setShowCancelModal(true)}
              className={`flex items-center gap-1 rounded-md px-4 py-2 text-white ${
                status === "PENDING_ACTION"
                  ? "bg-red-600 hover:bg-red-700"
                  : "cursor-not-allowed bg-gray-300"
              }`}
            >
              <Trash className="h-4 w-4" />
              ยกเลิกงาน
            </button>
          </>
        )}

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/20"
        >
          <Download className="h-4 w-4" />
          ดาวน์โหลด PDF
        </button>
      </div>
    </div>
  );
}