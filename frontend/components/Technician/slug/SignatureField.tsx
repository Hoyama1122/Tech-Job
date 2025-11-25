import React, { useRef } from "react";
import SignaturePad from "react-signature-canvas";
import { toast } from "react-toastify";

const SignatureField = ({ label, setValue }) => {
  const sigRef = useRef<any>(null);

  const clearSignature = () => sigRef.current.clear();
  const saveSignature = () => {
    if (!sigRef.current) return;
    if (sigRef.current.isEmpty()) {
      toast.warning("กรุณาเซ็นลายเซ็นก่อนบันทึก");
      return;
    }

    const dataURL = sigRef.current.toDataURL();
    setValue(dataURL);
    toast.success("บันทึกลายเซ็นเรียบร้อย");
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>

      <div className="border rounded-lg p-2 bg-gray-50">
        <SignaturePad
          ref={sigRef}
          canvasProps={{
            width: 300,
            height: 120,
            className: "border rounded-lg bg-white",
          }}
        />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={clearSignature}
          className="px-3 py-1 bg-gray-300 rounded-lg text-sm"
        >
          ลบ
        </button>
        <button
          type="button"
          onClick={saveSignature}
          className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm"
        >
          บันทึกลายเซ็น
        </button>
      </div>
    </div>
  );
};

export default SignatureField;
