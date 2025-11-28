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
}: any) {
  const router = useRouter();
  const auth = JSON.parse(localStorage.getItem("auth-storage") || "{}");
  const myRole = auth?.state?.role;

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
      
        {myRole === "supervisor" && (
          <>
            <button
              disabled={job.status !== "รอการตรวจสอบ"}
              className={`px-4 py-2 rounded-md text-white 
                ${
                  job.status === "รอการตรวจสอบ"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-300 cursor-not-allowed"
                }
              `}
              onClick={onReject}
            >
              ตีกลับงาน
            </button>

            <button
              disabled={job.status !== "รอการตรวจสอบ"}
              className={`px-4 py-2 rounded-md text-white 
                ${
                  job.status === "รอการตรวจสอบ"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-300 cursor-not-allowed"
                }
              `}
              onClick={onApprove}
            >
              อนุมัติงาน
            </button>
          </>
        )}

        {/* Admin: เห็น แก้ไข + ตีกลับ + อนุมัติ + ยกเลิกงาน */}
        {myRole === "admin" && (
          <>
            {/* แก้ไขงาน */}
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 bg-primary hover:bg-primary-hover
              text-white py-2 px-4 rounded-lg text-sm cursor-pointer transition font-semibold"
            >
              <Edit className="w-4 h-4" />
              แก้ไขงาน
            </button>

            {/* ตีกลับ */}
            <button
              disabled={job.status !== "รอการตรวจสอบ"}
              className={`px-4 py-2 rounded-md text-white 
                ${
                  job.status === "รอการตรวจสอบ"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-gray-300 cursor-not-allowed"
                }
              `}
              onClick={onReject}
            >
              ตีกลับงาน
            </button>

            {/* อนุมัติ */}
            <button
              disabled={job.status !== "รอการตรวจสอบ"}
              className={`px-4 py-2 rounded-md text-white 
                ${
                  job.status === "รอการตรวจสอบ"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-300 cursor-not-allowed"
                }
              `}
              onClick={onApprove}
            >
              อนุมัติงาน
            </button>

            <button
              disabled={job.status !== "รอการดำเนินงาน"}
              onClick={() => setShowCancelModal(true)}
              className={`px-4 py-2 rounded-md text-white flex items-center gap-1
                ${
                  job.status === "รอการดำเนินงาน"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-300 cursor-not-allowed"
                }
              `}
            >
              <Trash className="h-4 w-4" />
              ยกเลิกงาน
            </button>
          </>
        )}

        {/* ปุ่มโหลด PDF */}
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
