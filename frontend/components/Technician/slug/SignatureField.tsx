import React, { useRef, useEffect, useState } from "react";
import SignaturePad from "react-signature-canvas";
import { toast } from "react-toastify";

const SignatureField = ({ label, setValue }) => {
  const sigRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasWidth, setCanvasWidth] = useState(300);

  useEffect(() => {
    const resize = () => {
      if (containerRef.current) {
        setCanvasWidth(containerRef.current.offsetWidth - 8); 
      }
    };

    resize();
    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

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
    <div className="space-y-2" ref={containerRef}>
      <label className="block text-sm font-medium text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>

      <div className=" bg-gray-50">
        <SignaturePad
          ref={sigRef}
          canvasProps={{
            width: canvasWidth,
            height: 120,
            className: "border rounded-lg bg-white w-full",
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
          className="px-3 py-1 bg-primary text-white rounded-lg text-sm"
        >
          บันทึกลายเซ็น
        </button>
      </div>
    </div>
  );
};

export default SignatureField;
