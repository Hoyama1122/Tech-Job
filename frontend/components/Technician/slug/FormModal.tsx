import {
  X,
  Check,
  XCircle,
  Image as ImageIcon,
  AlertCircle,
  PlusCircle,
  Trash2,
  Package,
  Search,
} from "lucide-react";
import { useRef, useState, Dispatch, SetStateAction, useEffect } from "react";
import SignatureField from "./SignatureField";
import { compressImage } from "@/lib/compressImage";
import { TechnicianReportForm } from "@/lib/Validations/technicianReportSchema";
import { itemService } from "@/services/item.service";

interface FormModalProps {
  formData: TechnicianReportForm;
  setFormData: Dispatch<SetStateAction<TechnicianReportForm>>;
  imagesBefore: string[];
  setImagesBefore: Dispatch<SetStateAction<string[]>>;
  imagesAfter: string[];
  setImagesAfter: Dispatch<SetStateAction<string[]>>;
  handleSubmit: () => Promise<void>;
  setShowFormModal: (show: boolean) => void;
  errors: Record<string, string>;
}

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
}: FormModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allItems, setAllItems] = useState<any[]>([]);
  const [itemSearch, setItemSearch] = useState("");
  const uploadBeforeRef = useRef<HTMLInputElement>(null);
  const uploadAfterRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await itemService.getItems();
        setAllItems(data);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      }
    };
    fetchItems();
  }, []);

  const handleAddItem = (item: any) => {
    if (formData.items?.some((i) => i.id === item.id)) return;
    const newItem = {
      id: item.id,
      name: item.name,
      code: item.code,
      quantity: 1,
      unit: item.unit,
      type: item.type,
    };
    setFormData((prev) => ({
      ...prev,
      items: [...(prev.items || []), newItem],
    }));
    setItemSearch("");
  };

  const handleUpdateItemQuantity = (id: number, qty: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items?.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, qty) } : i
      ),
    }));
  };

  const handleRemoveItem = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items?.filter((i) => i.id !== id),
    }));
  };

  const filteredSearchItems = allItems.filter(
    (item) =>
      (item.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
        item.code.toLowerCase().includes(itemSearch.toLowerCase())) &&
      !formData.items?.some((i) => i.id === item.id),
  );

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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
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

          {/* ITEM USAGE SECTION */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                การเบิกใช้วัสดุและอุปกรณ์
              </label>
              <span className="text-xs text-gray-400">
                ({formData.items?.length || 0} รายการ)
              </span>
            </div>

            {/* Search items */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="ค้นหาพัสดุหรืออุปกรณ์..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary outline-none transition-all"
                  value={itemSearch}
                  onChange={(e) => setItemSearch(e.target.value)}
                />
              </div>

              {/* Search Results Dropdown */}
              {itemSearch && (
                <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                  {filteredSearchItems.length > 0 ? (
                    filteredSearchItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleAddItem(item)}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors border-b last:border-0 border-gray-100 text-left"
                      >
                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            {item.code} • {item.brand} {item.model}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            item.type === 'EQUIPMENT' 
                              ? 'text-primary' 
                              : 'text-accent'
                          }`}>
                            {item.type === 'EQUIPMENT' ? 'อุปกรณ์' : 'วัสดุ'}
                          </span>
                          <PlusCircle size={18} className="text-primary" />
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-400 text-sm">
                      ไม่พบพัสดุที่คุณค้นหา
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Items List */}
            <div className="space-y-2">
              {formData.items && formData.items.length > 0 ? (
                formData.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        item.type === 'EQUIPMENT' ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500'
                      }`}>
                        <Package size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {item.type === 'EQUIPMENT' ? 'อุปกรณ์ (ไม่หักสต็อก)' : 'วัสดุ (หักสต็อก)'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => handleUpdateItemQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-md transition-all text-gray-500"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="w-10 bg-transparent text-center text-sm font-bold outline-none"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItemQuantity(item.id, parseInt(e.target.value) || 1)}
                        />
                        <button
                          onClick={() => handleUpdateItemQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-md transition-all text-gray-500"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-xs text-gray-400 w-10">{item.unit}</span>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center text-gray-400">
                  <Package size={32} className="mb-2 opacity-20" />
                  <p className="text-xs">ยังไม่มีการเลือกวัสดุหรืออุปกรณ์</p>
                </div>
              )}
            </div>
          </div>

          {/* Signatures */}
          <SignatureField
            label="ลายเซ็นลูกค้า"
            setValue={(base64:any) =>
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
