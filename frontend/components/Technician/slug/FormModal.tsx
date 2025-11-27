import {
  X,
  Check,
  XCircle,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import { useRef, useState } from "react";
import SignatureField from "./SignatureField";
import { compressImage } from "@/lib/compressImage";

const FormModal = ({
  formData,
  setFormData,
  imagesBefore,
  setImagesBefore,
  imagesAfter,
  setImagesAfter,
  handleSubmit,
  setShowFormModal,
  errors,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const uploadBeforeRef = useRef<HTMLInputElement>(null);
  const uploadAfterRef = useRef<HTMLInputElement>(null);

  const handleUploadBefore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const base64 = await compressImage(file, 0.55);
      setImagesBefore((prev) => [...prev, base64]);
    }
  };

  const handleUploadAfter = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const base64 = await compressImage(file, 0.55);
      setImagesAfter((prev) => [...prev, base64]);
    }
  };

  const removeBefore = (i: number) => {
    setImagesBefore((p) => p.filter((_, idx) => idx !== i));
  };
  const removeAfter = (i: number) => {
    setImagesAfter((p) => p.filter((_, idx) => idx !== i));
  };

  const handleFormSubmit = async () => {
    setIsSubmitting(true);
    await handleSubmit();
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              บันทึกรายงานปิดงาน
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              กรอกข้อมูลการทำงานให้ครบถ้วน
            </p>
          </div>
          <button
            onClick={() => setShowFormModal(false)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* BEFORE WORK SECTION */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" />
              รูปก่อนทำงาน{" "}
              <span className="text-gray-400">({imagesBefore.length}/5)</span>
            </label>

            <button
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm hover:bg-primary/90"
              onClick={() => uploadBeforeRef.current?.click()}
            >
              อัปโหลดรูปก่อนทำงาน
            </button>

            <input
              ref={uploadBeforeRef}
              id="uploadBefore"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleUploadBefore}
            />

            {/* Preview */}
            {imagesBefore.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-2">
                {imagesBefore.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={img}
                      className="w-full h-20 object-cover rounded-lg border"
                    />
                    <button
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      onClick={() => removeBefore(i)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* AFTER WORK SECTION */}
          <div className="space-y-3 mt-6">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" />
              รูปหลังทำงาน{" "}
              <span className="text-gray-400">({imagesAfter.length}/5)</span>
            </label>

            <button
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm hover:bg-primary/90"
              onClick={() => uploadAfterRef.current?.click()}
            >
              อัปโหลดรูปหลังทำงาน
            </button>

            <input
              ref={uploadAfterRef}
              id="uploadAfter"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleUploadAfter}
            />

            {imagesAfter.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-2">
                {imagesAfter.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={img}
                      className="w-full h-20 object-cover rounded-lg border"
                    />
                    <button
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      onClick={() => removeAfter(i)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                รายละเอียดอาการ <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                rows={4}
                placeholder="อธิบายอาการที่พบเจอ เช่น พัดลมไม่หมุน, ไฟดับ..."
                value={formData.detail}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, detail: e.target.value }))
                }
              />
              {errors.detail && (
                <div className="mt-1 flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
                  <AlertCircle className="w-4 h-4" />
                  {errors.detail}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                ผลการตรวจสอบ
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                rows={4}
                placeholder="ผลจากการตรวจสอบ เช่น พบสาเหตุจาก..."
                value={formData.inspectionResults}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    inspectionResults: e.target.value,
                  }))
                }
              />
              {errors.inspectionResults && (
                <div className="mt-1 flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
                  <AlertCircle className="w-4 h-4" />
                  {errors.inspectionResults}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                การดำเนินการซ่อม
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                rows={4}
                placeholder="ขั้นตอนการซ่อม เช่น เปลี่ยนอะไหล่, ต่อสาย..."
                value={formData.repairOperations}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    repairOperations: e.target.value,
                  }))
                }
              />
              {errors.repairOperations && (
                <div className="mt-1 flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
                  <AlertCircle className="w-4 h-4" />
                  {errors.repairOperations}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                สรุปผลการดำเนินงาน <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                rows={4}
                placeholder="สรุปผลลัพธ์ เช่น ซ่อมสำเร็จ, รออะไหล่..."
                value={formData.summaryOfOperatingResults}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    summaryOfOperatingResults: e.target.value,
                  }))
                }
              />
              {errors.summaryOfOperatingResults && (
                <div className="mt-1 flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
                  <AlertCircle className="w-4 h-4" />
                  {errors.summaryOfOperatingResults}
                </div>
              )}
            </div>
          </div>

          {/* Signatures */}
          <SignatureField
            label="ลายเซ็นช่าง"
            setValue={(base64) =>
              setFormData((prev) => ({
                ...prev,
                technicianSignature: base64,
              }))
            }
          />

          <SignatureField
            label="ลายเซ็นลูกค้า"
            setValue={(base64) =>
              setFormData((prev) => ({
                ...prev,
                customerSignature: base64,
              }))
            }
          />
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
          <button
            onClick={() => setShowFormModal(false)}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            ยกเลิก
          </button>
          <button
            onClick={handleFormSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-primary to-primary-hover text-white py-2 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                กำลังบันทึก...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                บันทึกปิดงาน
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormModal;
