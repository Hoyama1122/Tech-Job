import React, { useState } from 'react';
import { UseFormSetValue, UseFormRegister } from 'react-hook-form';
import { WorkFormValues } from '@/lib/Validations/SchemaForm';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-toastify';

interface ImageUploadProps {
  setValue: UseFormSetValue<WorkFormValues>;
  register: UseFormRegister<WorkFormValues>;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ setValue, register }) => {
  const [preview, setPreview] = useState<string[]>([]);

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    if (files.length > 6) return toast.warning("อัปโหลดได้สูงสุด 6 รูป");
    setValue("image", files);
    setPreview(Array.from(files).map(URL.createObjectURL));
  };

  const removeImage = (index: number) => {
    const newPreviews = preview.filter((_, i) => i !== index);
    setPreview(newPreviews);
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const dt = new DataTransfer();
    if (input?.files) {
      Array.from(input.files).forEach(
        (file, i) => i !== index && dt.items.add(file)
      );
      setValue("image", dt.files);
    }
  };

  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
        <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
        รูปภาพประกอบ
      </label>
      <input type="hidden" {...register("image")} />

      <label className="inline-flex items-center gap-2 bg-primary px-3 py-1.5 rounded-lg cursor-pointer hover:bg-primary/80 transition text-white text-sm">
        <Plus size={18} />
        เพิ่มรูป
        <input
          type="file"
          className="hidden"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {preview.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-3">
          {preview.map((src, i) => (
            <div key={i} className="relative group">
              <Image
                src={src}
                alt={`preview-${i}`}
                width={120}
                height={120}
                className="w-full rounded-lg object-cover shadow-sm"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;